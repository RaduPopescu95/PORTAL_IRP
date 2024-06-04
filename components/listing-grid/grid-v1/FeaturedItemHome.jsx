"use client";

import Link from "next/link";
import Pagination from "../../common/blog/Pagination";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLength } from "../../../features/properties/propertiesSlice";
import properties from "../../../data/properties";
import Image from "next/image";
import {
  calculateDistance,
  filtrareParteneri,
  generateRandomGradient,
  toUrlSlug,
} from "@/utils/commonUtils";
import { fetchLocation } from "@/app/services/geocoding";
import { handleDiacrtice } from "@/utils/strintText";
import {
  handleQueryDoubleParam,
  handleQueryFirestore,
  handleQueryPatruParam,
  handleQueryTripleParam,
} from "@/utils/firestoreUtils";
import FeaturedProperty from "./Item";
import { useAuth } from "@/context/AuthContext";
import SkeletonLoader from "@/components/common/SkeletonLoader";

const FeaturedItemHome = ({ params }) => {
  const {
    keyword,
    location,
    status,
    propertyType,
    price,
    bathrooms,
    bedrooms,
    garages,
    yearBuilt,
    area,
    amenities,
  } = useSelector((state) => state.properties);
  const { statusType, featured, isGridOrList } = useSelector(
    (state) => state.filter
  );
  const { currentUser, setSearchQueryPateneri, searchQueryParteneri } =
    useAuth();

  const [parteneri, setParteneri] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isNoLocation, setIsNoLocation] = useState(false);
  const itemsPerPage = 10;

  const dispatch = useDispatch();

  async function fetchLocationAndUpdatePartners(latitude, longitude) {
    try {
      let res = await fetchLocation(latitude, longitude);
      console.log("res...here...", res);

      if (res && res.results && res.results.length > 0) {
        // Caută primul element cu proprietatea 'locality' definită
        const firstLocality = res.results.find(
          (result) => result.locality !== undefined
        );

        if (firstLocality && firstLocality.locality) {
          const localitate = handleDiacrtice(firstLocality.locality);
          updatePartnersByLocation(localitate, latitude, longitude);
        } else {
          console.error("Localitate missing in all results:", res);
        }
      } else {
        console.error("Invalid response or results missing:", res);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching location data: ", error);
    }
  }

  async function updatePartnersByLocation(localitate, latitude, longitude) {
    let parteneri = await handleQueryTripleParam(
      "Users",
      "localitate",
      localitate,
      "userType",
      "Partener",
      "statusCont",
      "Activ"
    );

    let parteneriCuDistanta = parteneri.map((partener) => {
      const distanta = calculateDistance(
        latitude,
        longitude,
        partener.coordonate.lat,
        partener.coordonate.lng
      );
      return { ...partener, distanta: Math.floor(distanta) };
    });

    let parteneriOrdonati = parteneriCuDistanta.sort(
      (a, b) => a.distanta - b.distanta
    );

    setParteneri(parteneriOrdonati);
    setIsLoading(false);
  }

  function handleGeoSuccess(position) {
    const { latitude, longitude } = position.coords;
    fetchLocationAndUpdatePartners(latitude, longitude);
  }

  function handleGeoError(error) {
    // alert("Geolocation error: ", error.message);
    console.error("Geolocation error: ", error.message);
    setIsLoading(false);
    // setIsNoLocation(true);
    // Informează utilizatorul despre cum poate activa locația manual
    if (error.code === error.PERMISSION_DENIED) {
      setIsNoLocation(true);
    }
  }

  const requestLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleGeoSuccess,
        handleGeoError,
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleGeoSuccess,
        handleGeoError
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  }, []);

  const paginatedParteneri = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return parteneri.slice(startIndex, endIndex);
  };

  // status handler
  let content = paginatedParteneri()
    .slice(0, 10)
    .map((item) => (
      <div
        className={`${
          isGridOrList ? "col-12 feature-list" : "col-md-4 col-lg-4"
        } `}
        key={item?.id}
      >
        {currentUser ? (
          <Link
            href={`/partener/${item?.id}-${toUrlSlug(item?.denumireBrand)}`}
            key={item?.id}
            passHref
          >
            <FeaturedProperty item={item} isGridOrList={isGridOrList} />
          </Link>
        ) : (
          <a
            key={item?.id}
            data-bs-toggle="modal"
            data-bs-target=".bd-utilizator-modal-lg"
          >
            <FeaturedProperty item={item} isGridOrList={isGridOrList} />
          </a>
        )}
      </div>
    ));

  // add length of filter items
  useEffect(() => {
    dispatch(addLength(content.length));
  }, [dispatch, content]);

  return (
    <>
      {isLoading ? <SkeletonLoader /> : content}
      {isNoLocation && (
        <div className="d-flex justify-content-center align-items-center">
          <p>
            Accesul la locație a fost blocat. Te rog activează accesul la
            locație din setările browserului sau dispozitivului tău.
          </p>
        </div>
      )}
      {(paginatedParteneri().length === 0 && !isLoading) && (
        <div className="d-flex justify-content-center align-items-center">
          <p>Nu sunt parteneri în apropiere.</p>
        </div>
      )}
    </>
  );
};

export default FeaturedItemHome;
