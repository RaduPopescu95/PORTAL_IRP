const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  host: "mail.creditemedicale.ro",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "exclusivmd@creditemedicale.ro",
    pass: "vtn0079su8dh",
  },
});

exports.sendConfirmationEmails = functions.firestore
    .document("Users/{userId}/OferteInregistrate/{offerId}")
    .onUpdate(async (change, context) => {
      const newV = change.after.data();
      const oldV = change.before.data();

      if (newV.status === "Confirmata" && oldV.status !== "Confirmata") {
        try {
          const doctorRef = admin.firestore().doc(`Users/${newV.idUtilizator}`);
          const partRef = admin.firestore().doc(`Users/${newV.collectionId}`);

          const [doctor, partener] = await Promise.all([
            doctorRef.get(),
            partRef.get(),
          ]);

          const emails = [doctor.data().email, partener.data().email];
          const text =
          `Tranzactia înregistrată pentru oferta` +
          ` ${oldV.oferta.titluOferta} a fost confirmată de către echipa ` +
          `noastră. Pentru detalii suplimentare accesați www.exclusivmd.ro`;

          const mailOptions = (email) => ({
            from: "exclusivmd@creditemedicale.ro",
            to: email,
            subject: `Confirmare Oferta ${oldV.oferta.titluOferta}`,
            text,
          });

          for (const email of emails) {
            try {
              await transporter.sendMail(mailOptions(email));
              console.log(`Email trimis cu succes la: ${email}`);
            } catch (error) {
              console.error(
                  `Eroare la trimiterea emailului la ${email}: `,
                  error,
              );
            }
          }
        } catch (error) {
          console.error("Eroare la preluarea datelor utilizatorilor: ", error);
        }
      }
      return null;
    });


exports.sendDeactivationEmails = functions.pubsub
    .schedule("every 24 hours")
    .timeZone("Europe/Bucharest")
    .onRun(async (context) => {
      const today = new Date().toISOString().slice(0, 10);
      const usersRef = admin.firestore().collection("Users");

      const querySnapshot = await usersRef.get();
      const emailsToSend = [];

      for (const doc of querySnapshot.docs) {
        const oR = doc.ref.collection("Oferte");
        const oS = await oR.where("dataDezactivare", "==", today).get();
        if (!oS.empty) {
          const userData = doc.data();
          const userEmail = userData.email;
          oS.forEach((offerDoc) => {
            emailsToSend.push({
              email: userEmail,
              offerTitle: offerDoc.data().titluOferta,
            });
          });
        }
      }

      for (const {email, offerTitle} of emailsToSend) {
        const cText = "Pentru detalii suplimentare accesați www.exclusivmd.ro";
        const text = `Oferta ${offerTitle} a expirat astăzi. ${cText}`;
        const mailOptions = {
          from: "exclusivmd@creditemedicale.ro",
          to: email,
          subject: `Expirare Oferta ${offerTitle}`,
          text,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Email trimis cu succes la: ${email}`);
        } catch (error) {
          console.error(`Eroare la trimiterea emailului la ${email}: `, error);
        }
      }

      return null;
    });

