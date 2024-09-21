import { toUrlSlug } from "@/utils/commonUtils";
import {
  handleGetFirestore,
  handleQueryFirestore,
} from "@/utils/firestoreUtils";
import { parseDateToISO } from "@/utils/timeUtils";

const URL = "https://exclusivmd.ro";

export default async function sitemap() {
  console.log("Fetching 'Judete' data from Firestore...");
  const judeteData = await handleGetFirestore("Judete");
  console.log("Judete Data:", judeteData);

  console.log("Fetching 'Parteneri' from Firestore...");
  const parteneri = await handleQueryFirestore("Users", "userType", "Partener");
  console.log("Parteneri Data:", parteneri);

  const seenUrls = new Set();

  console.log("Processing 'judeteCategorii'...");
  const judeteCategorii = parteneri.reduce((acc, { partener, _updatedAt }) => {
    console.log("partener...sitemap", partener);
    if (partener?.categorie && partener?.judet) {
      const url = `${URL}/${partener.categorie.toLowerCase()}/${partener.categorie.toLowerCase()}-${partener.judet.toLowerCase()}`;
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        acc.push({
          url: url,
          lastModified: parseDateToISO(partener.firstUploadDate),
        });
        console.log(`Added judeteCategorie URL: ${url}`);
      }
    }
    return acc;
  }, []);
  console.log("Finished processing 'judeteCategorii'.", judeteCategorii);

  console.log("Processing 'parteners'...");
  const parteners = parteneri.reduce((acc, { item, _updatedAt }) => {
    if (item?.id && item?.denumireBrand) {
      const url = `${URL}/partener/${item.id}-${toUrlSlug(item.denumireBrand)}`;
      acc.push({
        url: url,
        lastModified: parseDateToISO(item.firstUploadDate),
      });
      console.log(`Added partner URL: ${url}`);
    }
    return acc;
  }, []);
  console.log("Finished processing 'parteners'.", parteners);

  console.log("Processing 'judete'...");
  const judete = judeteData.reduce((acc, { judet, _updatedAt }) => {
    if (judet?.judet) {
      const url = `${URL}/${judet.judet.toLowerCase()}`;
      acc.push({
        url: url,
        lastModified: _updatedAt,
      });
      console.log(`Added judet URL: ${url}`);
    }
    return acc;
  }, []);
  console.log("Finished processing 'judete'.", judete);

  console.log("Generating static routes...");
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
  ].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
  }));
  console.log("Static routes:", routes);

  const fullSitemap = [...routes, ...judete, ...judeteCategorii, ...parteners];
  console.log("Full Sitemap Generated:", fullSitemap);
  return fullSitemap;
}
