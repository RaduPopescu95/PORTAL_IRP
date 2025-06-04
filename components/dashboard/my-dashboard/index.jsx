"use client";

import Header from "../../common/header/dashboard/Header";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu";
import MobileMenu from "../../common/header/MobileMenu";
import Activities from "./Activities";
import AllStatistics from "./AllStatistics";
import HelloUser from "./HelloUser";
import StatisticsChart from "./StatisticsChart";

const index = () => {
  return (
    <>
      {/* <!-- Main Header Nav --> */}
      {/* <Header /> */}

      {/* <!--  Mobile Menu --> */}
      {/* <MobileMenu /> */}

      <div className="dashboard_sidebar_menu">
        <div
          className="offcanvas offcanvas-dashboard offcanvas-start"
          tabIndex="-1"
          id="DashboardOffcanvasMenu"
          data-bs-scroll="true"
        >
          <SidebarMenu />
        </div>
      </div>
      {/* End sidebar_menu */}

      {/* <!-- Our Dashbord --> */}
      <section className="our-dashbord dashbord bgc-f7 pb50">
        <div className="container-fluid ovh">
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row">
                {/* Start Dashboard Navigation */}
                <div className="col-lg-12">
                  <div className="dashboard_navigationbar dn db-1024">
                    <div className="dropdown">
                      <button
                        className="dropbtn"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#DashboardOffcanvasMenu"
                        aria-controls="DashboardOffcanvasMenu"
                        style={{
                          minHeight: '48px', // Better touch target
                          fontSize: '16px'
                        }}
                      >
                        <i className="fa fa-bars pr10"></i> Navigatie panou
                        administrare
                      </button>
                    </div>
                  </div>
                </div>
                {/* End Dashboard Navigation */}

                {/* PWA Quick Actions for Mobile */}
                <div className="col-12 d-block d-lg-none mb-3">
                  <div className="pwa-quick-actions" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px',
                    padding: '16px',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <a 
                      href="/creaza-BICP" 
                      className="quick-action"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '16px',
                        background: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        minHeight: '80px',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      <i className="flaticon-plus" style={{ fontSize: '24px', marginBottom: '8px' }}></i>
                      <span>Creează BICP</span>
                    </a>
                    <a 
                      href="/creaza-acreditare" 
                      className="quick-action"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '16px',
                        background: '#28a745',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        minHeight: '80px',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      <i className="flaticon-plus" style={{ fontSize: '24px', marginBottom: '8px' }}></i>
                      <span>Creează Acreditare</span>
                    </a>
                    <a 
                      href="/lista-BICP" 
                      className="quick-action"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '16px',
                        background: '#6c757d',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        minHeight: '80px',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      <i className="flaticon-layers" style={{ fontSize: '24px', marginBottom: '8px' }}></i>
                      <span>Lista BICP</span>
                    </a>
                    <a 
                      href="/lista-acreditari" 
                      className="quick-action"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '16px',
                        background: '#17a2b8',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        minHeight: '80px',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      <i className="flaticon-layers" style={{ fontSize: '24px', marginBottom: '8px' }}></i>
                      <span>Lista Acreditări</span>
                    </a>
                  </div>
                </div>

                {/* <HelloUser /> */}
              </div>
              {/* End .row */}

              <div className="row">
                <AllStatistics />
              </div>
              {/* End .row Dashboard top statistics */}

              <div className="row">
                {/* <div className="col-xl-7">
                  <div className="application_statics">
                    <h4 className="mb-4">View Statistics</h4>
                    <StatisticsChart />
                  </div>
                </div> */}
                {/* End statistics chart */}

                {/* <div className="col-xl-12">
                  <div className="recent_job_activity">
                    <h4 className="title mb-4">Oferte accesate recent</h4>
                    <Activities />
                  </div>
                </div> */}
              </div>
              {/* End .row  */}
            </div>
            {/* End .col */}
          </div>
        </div>
      </section>

      <style jsx>{`
        .quick-action:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }

        @media (max-width: 767px) {
          .dashboard_navigationbar .dropbtn {
            width: 100%;
            text-align: left;
          }
        }

        /* Touch-friendly improvements */
        @media (hover: none) and (pointer: coarse) {
          .quick-action {
            transform: none !important;
          }
          
          .quick-action:active {
            transform: scale(0.95) !important;
            transition: transform 0.1s ease;
          }
        }
      `}</style>
    </>
  );
};

export default index;
