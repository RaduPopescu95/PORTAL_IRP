import React, { useEffect, useState } from "react";
import CreateList from "@/components/dashboard/verificare-tranzactie/CreateList";
import Form from "@/components/autentificare-partener/Form";
import { useAuth } from "@/context/AuthContext";
import { authentication } from "@/firebase";

const TransactionVerification = ({
  oferta,
  utilizator,

  isVerified,
  partenerId,
}) => {
  return (
    <div className="col-lg-12 mb10">
      <div className="breadcrumb_content style2">
        {!isVerified ? null : (
          <h2 className="breadcrumb_title">Verificare tranzacție</h2>
        )}
      </div>
      {!isVerified ? (
        <section className="dashboard-sigin-container">
          <div className="container">
            <div className="row">
              {/* <div className="col-sm-12 col-lg-6 offset-lg-3"> */}
              {/* <div className="col-sm-12 col-lg-6 offset-lg-2"> */}
              <div className="col-sm-12 col-lg-6 offset-lg-1">
                <div className="login_form inner_page">
                  <Form partenerId={partenerId} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="col-lg-12">
          <div className="my_dashboard_review">
            <div className="row">
              <CreateList oferta={oferta} utilizator={utilizator} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionVerification;
