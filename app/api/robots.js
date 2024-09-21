// app/api/robots.js

import { toUrlSlug } from "@/utils/commonUtils";
import {
  handleGetFirestore,
  handleQueryFirestore,
} from "@/utils/firestoreUtils";

const URL = "https://exclusivmd.ro";

export async function GET(req, res) {
  const judeteData = await handleGetFirestore("Judete");
  const parteneri = await handleQueryFirestore("Users", "userType", "Partener");

  const seenUrls = new Set();

  const judeteCategorii = parteneri.reduce((acc, { partener }) => {
    if (partener?.categorie && partener?.judet) {
      // Verifică dacă există categorie și judet
      const url = `/${partener.categorie.toLowerCase()}/${partener.categorie.toLowerCase()}-${partener.judet.toLowerCase()}`;
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        acc.push(url);
      }
    }
    return acc;
  }, []);

  const parteners = parteneri.reduce((acc, { item }) => {
    if (item?.id && item?.denumireBrand) {
      // Verifică dacă există id și denumireBrand
      const url = `/partener/${item.id}-${toUrlSlug(item.denumireBrand)}`;
      acc.push(url);
    }
    return acc;
  }, []);

  const judete = judeteData.reduce((acc, { judet }) => {
    if (judet?.judet) {
      // Verifică dacă există judet
      const url = `/${judet.judet.toLowerCase()}`;
      acc.push(url);
    }
    return acc;
  }, []);

  const routes = [
    "",
    "/despre-noi",
    "/termeni-confidentialitate",
    "/contact",
    "/plangeri",
    "/autovehicule",
    "/servicii",
    "/cafenele",
    "/restaurante",
    "/hoteluri",
    "/altele",
  ];

  const allowedUrls = [...routes, ...judete, ...judeteCategorii, ...parteners];

  res.setHeader("Content-Type", "text/plain");
  res.write("User-agent: *\n");
  res.write("Disallow: /\n");

  allowedUrls.forEach((url) => {
    res.write(`Allow: ${url}\n`);
  });

  res.end();
}
