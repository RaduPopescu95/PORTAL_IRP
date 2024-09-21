import Link from "next/link";
import Social from "./Social";
import SubscribeForm from "./SubscribeForm";

const Footer = () => {
  return (
    <>
      <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4 pr0 pl0">
        <div className="footer_about_widget">
          <h4>ExclusivMD</h4>
          <p>
            ExclusivMD este un portal dedicat medicilor, având scopul de a aduce
            în atenția acestora cele mai bune oferte de la parteneri economici
            din diverse domenii. Portalul este conceput pentru a economisi timp
            și a oferi soluții eficiente, menite să sprijine activitatea zilnică
            a medicilor și să contribuie la îmbunătățirea calității serviciilor
            medicale oferite.
          </p>
        </div>
      </div>
      {/* End .col */}

      <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4">
        <div className="footer_qlink_widget">
          <h4>Companie</h4>
          <ul className="list-unstyled">
            <li>
              <Link href="/despre-noi">Despre noi</Link>
            </li>
            <li>
              <Link href="/termeni-confidentialitate">Termeni si conditii</Link>
            </li>
            {/* <li>
              <Link href="/faq">User’s Guide</Link>
            </li> */}
            {/* <li>
              <Link href="/cum-functioneaza">Cum functioneaza</Link>
            </li> */}
          </ul>
        </div>
      </div>
      {/* End .col */}

      <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4">
        <div className="footer_contact_widget">
          <h4>Contactează-ne</h4>
          <ul className="list-unstyled">
            <li>
              <a href="mailto:exclusivmd@creditemedicale.ro">
                exclusivmd@creditemedicale.ro
              </a>
            </li>
            {/* <li>
              <a href="#">Bucurest, str. Cernauti, nr.1A</a>
            </li>
            <li>
              <a href="tel:+079999999">079999999</a>
            </li> */}
          </ul>
        </div>
      </div>
      {/* End .col */}

      {/* <div className="col-sm-6 col-md-6 col-lg-3 col-xl-3">
        <div className="footer_social_widget">
          <h4>Urmărește-ne</h4>
          <ul className="mb30">
            <Social />
          </ul>
          <h4>Subscribe</h4>
          <SubscribeForm />
        </div>
      </div> */}
    </>
  );
};

export default Footer;
