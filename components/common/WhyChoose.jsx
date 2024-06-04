const WhyChoose = ({ style = "" }) => {
  const whyCooseContent = [
    {
      id: 1,
      icon: "flaticon-high-five",
      title: "Încrederea a Mii de Clienti",
      descriptions: `Platforma noastră este locul unde mii de doctori găsesc clinicile potrivite pentru nevoile lor medicale, grație unei selecții riguroase a partenerilor noștri. Prioritizăm încrederea și satisfacția pacienților, asigurându-ne că fiecare clinică înregistrată îndeplinește standarde înalte de calitate și profesionalism.`,
    },
    {
      id: 2,
      icon: "flaticon-home-1",
      title: "O Gamă Variată de Clinici",
      descriptions: `Cu o diversitate impresionantă de clinici înregistrate, hub-ul nostru asigură accesul pacienților la o varietate largă de specialități medicale și tratamente. Indiferent de complexitatea nevoilor lor de sănătate, pacienții pot găsi cu ușurință opțiuni de îngrijire medicală adecvate, oferite de echipe de specialiști dedicați.`,
    },
    {
      id: 3,
      icon: "flaticon-profit",
      title: "Creștere Profit prin Discounturi Exclusiviste",
      descriptions: `Oferiți pacienților acces la îngrijire medicală de calitate la prețuri accesibile, participând la sistemul nostru de discount. Aceasta nu doar încurajează vizitele repetate, dar și vă extinde baza de clienți, maximizând astfel profiturile clinicii. Beneficiați de o soluție simplă pentru a vă construi o reputație puternică și a crește loialitatea pacienților.`,
    },
  ];

  return (
    <>
      {whyCooseContent.map((item) => (
        <div className="col-md-6 col-lg-4 col-xl-4" key={item.id}>
          <div className={`why_chose_us ${style}`}>
            <div className="icon">
              <span className={item.icon}></span>
            </div>
            <div className="details">
              <h4>{item.title}</h4>
              <p>{item.descriptions}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default WhyChoose;
