import { totaluri, totaluriSaptamanale } from "@/data/constants";
import { formatDate, getLastMonday, getNextMonday } from "@/utils/commonUtils";
import {
  getFirestoreCollectionLength,
  handleGetFirestore,
} from "@/utils/firestoreUtils";

const AllStatistics = async () => {
  const comunicate = await handleGetFirestore("Comunicate");
  const interventii = await handleGetFirestore("Interventii");
  const solicitariVerbale = await handleGetFirestore("SolcitariVerbale");

  //TOTAL

  interventii.forEach((item) => {
    totaluri.alarmaFalsa += Number(item.alarmaFalsa);
    totaluri.alteSU += Number(item.alteSU);
    totaluri.asistentaPersoane += Number(item.asistentaPersoane);
    totaluri.deblocareUsa += Number(item.deblocareUsa);
    totaluri.descarcerare += Number(item.descarcerare);
    totaluri.evenimentRutier += Number(item.evenimentRutier);
    totaluri.exercitii += Number(item.exercitii);
    totaluri.explozie += Number(item.explozie);
    totaluri.incendii += Number(item.incendii);
    totaluri.incendiiDeVegetatie += Number(item.incendiiDeVegetatie);
    totaluri.informare += Number(item.informare);
    totaluri.inundatii += Number(item.inundatii);
    totaluri.nrMP += Number(item.nrMP);
    totaluri.pirotehnic += Number(item.pirotehnic);
    totaluri.recunoasteri += Number(item.recunoasteri);
    totaluri.salvareAnimal += Number(item.salvareAnimal);
    totaluri.smurd += Number(item.smurd);
    totaluri.verificareATI += Number(item.verificareATI);
  });

  //SAPTAMANAL
  const lastMonday = getLastMonday();
  const nextMonday = getNextMonday(lastMonday);

  console.log("nextMonday...", lastMonday);
  console.log("nextMonday...", nextMonday);

  const interventiiSaptamanale = interventii.filter((item) => {
    const itemDate = new Date(
      item.firstUploadDate.split("-").reverse().join("-")
    );
    return itemDate >= lastMonday && itemDate < nextMonday;
  });

  interventiiSaptamanale.forEach((item) => {
    totaluriSaptamanale.alarmaFalsa += Number(item.alarmaFalsa);
    totaluriSaptamanale.alteSU += Number(item.alteSU);
    totaluriSaptamanale.asistentaPersoane += Number(item.asistentaPersoane);
    totaluriSaptamanale.deblocareUsa += Number(item.deblocareUsa);
    totaluriSaptamanale.descarcerare += Number(item.descarcerare);
    totaluriSaptamanale.evenimentRutier += Number(item.evenimentRutier);
    totaluriSaptamanale.exercitii += Number(item.exercitii);
    totaluriSaptamanale.explozie += Number(item.explozie);
    totaluriSaptamanale.incendii += Number(item.incendii);
    totaluriSaptamanale.incendiiDeVegetatie += Number(item.incendiiDeVegetatie);
    totaluriSaptamanale.informare += Number(item.informare);
    totaluriSaptamanale.inundatii += Number(item.inundatii);
    totaluriSaptamanale.nrMP += Number(item.nrMP);
    totaluriSaptamanale.pirotehnic += Number(item.pirotehnic);
    totaluriSaptamanale.recunoasteri += Number(item.recunoasteri);
    totaluriSaptamanale.salvareAnimal += Number(item.salvareAnimal);
    totaluriSaptamanale.smurd += Number(item.smurd);
    totaluriSaptamanale.verificareATI += Number(item.verificareATI);
  });

  const allStatistics = [
    {
      id: 1,
      blockStyle: "",
      timer: totaluri.incendii,
      name: "Incendii",
    },
    {
      id: 2,
      blockStyle: "style2",
      timer: totaluri.incendiiDeVegetatie,
      name: "Incendii vegetatie",
    },
    {
      id: 6,
      blockStyle: "style2",
      timer: totaluri.nrMP,
      name: "Suprafete (mp)",
    },
    {
      id: 3,
      blockStyle: "style3",
      timer: totaluri.evenimentRutier,
      name: "Accidente rutiere",
    },
    {
      id: 4,
      blockStyle: "style4",
      timer: totaluri.smurd,
      name: "SMURD",
    },
    {
      id: 5,
      blockStyle: "style4",
      timer: totaluri.alteSU,
      name: "Alte interventii",
    },
    {
      id: 7,
      blockStyle: "style5",
      timer: totaluri.alarmaFalsa,
      name: "Alarma falsa",
    },
    {
      id: 8,
      blockStyle: "style6",
      timer: totaluri.asistentaPersoane,
      name: "Asistenta persoane",
    },
    {
      id: 9,
      blockStyle: "style7",
      timer: totaluri.deblocareUsa,
      name: "Deblocare usa",
    },
    {
      id: 10,
      blockStyle: "style8",
      timer: totaluri.descarcerare,
      name: "Descarcerare",
    },
    {
      id: 11,
      blockStyle: "style9",
      timer: totaluri.exercitii,
      name: "Exercitii",
    },
    {
      id: 12,
      blockStyle: "style10",
      timer: totaluri.explozie,
      name: "Explozie",
    },
    {
      id: 13,
      blockStyle: "style11",
      timer: totaluri.informare,
      name: "Informare",
    },
    {
      id: 14,
      blockStyle: "style12",
      timer: totaluri.inundatii,
      name: "Inundatii",
    },
    {
      id: 15,
      blockStyle: "style13",
      timer: totaluri.pirotehnic,
      name: "Pirotehnic",
    },
    {
      id: 16,
      blockStyle: "style14",
      timer: totaluri.recunoasteri,
      name: "Recunoasteri",
    },
    {
      id: 17,
      blockStyle: "style15",
      timer: totaluri.salvareAnimal,
      name: "Salvare animal",
    },
    {
      id: 18,
      blockStyle: "style16",
      timer: totaluri.verificareATI,
      name: "Verificare ATI",
    },
  ];

  const interventiiSapt = [
    {
      id: 1,
      blockStyle: "",
      timer: totaluriSaptamanale.incendii,
      name: "Incendii",
    },
    {
      id: 2,
      blockStyle: "style2",
      timer: totaluriSaptamanale.incendiiDeVegetatie,
      name: "Incendii vegetatie",
    },
    {
      id: 6,
      blockStyle: "style2",
      timer: totaluriSaptamanale.nrMP,
      name: "Suprafete (mp)",
    },
    {
      id: 3,
      blockStyle: "style3",
      timer: totaluriSaptamanale.evenimentRutier,
      name: "Accidente rutiere",
    },
    {
      id: 4,
      blockStyle: "style4",
      timer: totaluriSaptamanale.smurd,
      name: "SMURD",
    },
    {
      id: 5,
      blockStyle: "style4",
      timer: totaluriSaptamanale.alteSU,
      name: "Alte interventii",
    },
    {
      id: 7,
      blockStyle: "style5",
      timer: totaluriSaptamanale.alarmaFalsa,
      name: "Alarma falsa",
    },
    {
      id: 8,
      blockStyle: "style6",
      timer: totaluriSaptamanale.asistentaPersoane,
      name: "Asistenta persoane",
    },
    {
      id: 9,
      blockStyle: "style7",
      timer: totaluriSaptamanale.deblocareUsa,
      name: "Deblocare usa",
    },
    {
      id: 10,
      blockStyle: "style8",
      timer: totaluriSaptamanale.descarcerare,
      name: "Descarcerare",
    },
    {
      id: 11,
      blockStyle: "style9",
      timer: totaluriSaptamanale.exercitii,
      name: "Exercitii",
    },
    {
      id: 12,
      blockStyle: "style10",
      timer: totaluriSaptamanale.explozie,
      name: "Explozie",
    },
    {
      id: 13,
      blockStyle: "style11",
      timer: totaluriSaptamanale.informare,
      name: "Informare",
    },
    {
      id: 14,
      blockStyle: "style12",
      timer: totaluriSaptamanale.inundatii,
      name: "Inundatii",
    },
    {
      id: 15,
      blockStyle: "style13",
      timer: totaluriSaptamanale.pirotehnic,
      name: "Pirotehnic",
    },
    {
      id: 16,
      blockStyle: "style14",
      timer: totaluriSaptamanale.recunoasteri,
      name: "Recunoasteri",
    },
    {
      id: 17,
      blockStyle: "style15",
      timer: totaluriSaptamanale.salvareAnimal,
      name: "Salvare animal",
    },
    {
      id: 18,
      blockStyle: "style16",
      timer: totaluriSaptamanale.verificareATI,
      name: "Verificare ATI",
    },
  ];
  const totalSolicitariComunicate = [
    {
      id: 1,
      blockStyle: "",
      timer: comunicate.length,
      name: "Comunicate TOTAL",
    },
    {
      id: 2,
      blockStyle: "style2",
      timer: solicitariVerbale.length,
      name: "Solicitari Verbale TOTAL",
    },
  ];
  const lunaSolicitariComunicate = [
    {
      id: 1,
      blockStyle: "",
      timer: totaluriSaptamanale.incendii,
      name: "Incendii",
    },
    {
      id: 2,
      blockStyle: "style2",
      timer: totaluriSaptamanale.incendiiDeVegetatie,
      name: "Incendii vegetatie",
    },
  ];

  return (
    <>
      <div class="accordion" id="accordionExample">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingOne">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Statistici Saptamanale INTERVENTII - interval{" "}
              {formatDate(lastMonday)} - {formatDate(nextMonday)}
            </button>
          </h2>
          <div
            id="collapseOne"
            class="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <div class="row">
                {interventiiSapt.map((item) => (
                  <div
                    className="col-sm-6 col-md-6 col-lg-6 col-xl-3"
                    key={item.id}
                  >
                    <div className={`ff_one ${item.blockStyle}`}>
                      <div className="detais">
                        <div className="timer">{item.timer}</div>
                        <p>{item.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingTwo">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Statistici Totale INTERVENTII
            </button>
          </h2>
          <div
            id="collapseTwo"
            class="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <div class="row">
                {allStatistics.map((item) => (
                  <div
                    className="col-sm-6 col-md-6 col-lg-6 col-xl-3"
                    key={item.id}
                  >
                    <div className={`ff_one ${item.blockStyle}`}>
                      <div className="detais">
                        <div className="timer">{item.timer}</div>
                        <p>{item.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingThree">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Statistici Totale COMUNICATE/SOLICITARI
            </button>
          </h2>
          <div
            id="collapseTwo"
            class="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <div class="row">
                {totalSolicitariComunicate.map((item) => (
                  <div
                    className="col-sm-6 col-md-6 col-lg-6 col-xl-3"
                    key={item.id}
                  >
                    <div className={`ff_one ${item.blockStyle}`}>
                      <div className="detais">
                        <div className="timer">{item.timer}</div>
                        <p>{item.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {interventiiTreiLuni.map((item) => (
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3" key={item.id}>
          <div className={`ff_one ${item.blockStyle}`}>
            <div className="detais">
              <div className="timer">{item.timer}</div>
              <p>{item.name}</p>
            </div>
          </div>
        </div>
      ))}
      {interventiiAnual.map((item) => (
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3" key={item.id}>
          <div className={`ff_one ${item.blockStyle}`}>
            <div className="detais">
              <div className="timer">{item.timer}</div>
              <p>{item.name}</p>
            </div>
          </div>
        </div>
      ))} */}
    </>
  );
};

export default AllStatistics;
