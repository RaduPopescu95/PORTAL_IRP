"use client";

import TopNavbar from "../../common/header/dashboard/TopNavbar";
import Activities from "./Activities";
import AllStatistics from "./AllStatistics";
import HelloUser from "./HelloUser";
import StatisticsChart from "./StatisticsChart";

const index = () => {
  return (
    <>
      {/* Top & Bottom Navigation */}
      <TopNavbar />

      {/* <!-- Our Dashbord --> */}
      <section className="our-dashbord dashbord bgc-f7 pb50">
        <div className="container-fluid ovh">
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row">




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
