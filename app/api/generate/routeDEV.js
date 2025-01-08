// import { google } from "googleapis";
// import { NextResponse } from "next/server";
// const fs = require("fs");
// const path = require("path");

// const filePath = path.resolve(__dirname, process.env.GOOGLE_CLOUD_KEY);

// if (fs.existsSync(filePath)) {
//   console.log("Key file found at:", filePath);
// } else {
//   console.log("Key file not found");
// }

// // Calea absolută către fișierul JSON
// const keyFilePath = path.resolve(process.env.GOOGLE_CLOUD_KEY);

// // Citește manual fișierul JSON
// const keyFileContent = JSON.parse(fs.readFileSync(keyFilePath, "utf8"));
// let auth;
// try {
//   console.log("Initializing auth...");
//   auth = new google.auth.GoogleAuth({
//     credentials: keyFileContent,
//     scopes: [
//       "https://www.googleapis.com/auth/drive",
//       "https://www.googleapis.com/auth/documents",
//     ],
//   });
//   console.log("Auth initialized:", auth);
// } catch (error) {
//   console.error("Error during authentication:", error);
// }

// const drive = google.drive({ version: "v3", auth });
// const docs = google.docs({ version: "v1", auth });

// // Funcția pentru a seta permisiunile documentului generat
// const setFilePermissions = async (fileId) => {
//   try {
//     const drive = google.drive({ version: "v3", auth });

//     // Setează permisiunile pentru ca oricine să poată vizualiza documentul
//     await drive.permissions.create({
//       fileId: fileId,
//       requestBody: {
//         role: "reader",
//         type: "user", // Setează permisiunile pentru oricine are link-ul
//         emailAddress: "irp.isudb@gmail.com",
//       },
//     });

//     await drive.permissions.create({
//       fileId: fileId,
//       requestBody: {
//         role: "reader",
//         type: "anyone", // Acces pentru oricine are link-ul
//       },
//     });

//     console.log("Permissions set successfully");
//   } catch (error) {
//     console.error("Error setting permissions:", error.message);
//   }
// };

// // Creează o copie a documentului model în Google Drive
// const createDocumentCopy = async (templateId, newTitle) => {
//   try {
//     console.log("start....drive....1", templateId);
//     console.log("start....drive....1", newTitle);
//     const copy = await drive.files.copy({
//       fileId: templateId,
//       requestBody: {
//         name: newTitle, // Numele noului document
//       },
//     });
//     console.log("start....drive....2");
//     return copy.data.id; // Returnează ID-ul noii copii a documentului
//   } catch (error) {
//     throw new Error("Error creating document copy: " + error.message);
//   }
// };

// // Înlocuiește variabilele din documentul copiat
// const replaceVariables = async (documentId, variables) => {
//   const requests = Object.keys(variables).map((variable) => ({
//     replaceAllText: {
//       containsText: {
//         text: `{{${variable}}}`, // Șablonul pentru variabilă (e.g. {{nume}})
//         matchCase: true,
//       },
//       replaceText: variables[variable], // Textul care va înlocui variabila
//     },
//   }));

//   await docs.documents.batchUpdate({
//     documentId,
//     requestBody: {
//       requests,
//     },
//   });

//   return documentId;
// };

// // Functie API pentru ruta de generare document
// export async function POST(req) {
//   try {
//     console.log("start...1");
//     const { templateId, variables, newTitle } = await req.json(); // Extrage datele din corpul cererii
//     console.log("start...2");

//     // Apelează funcția după generarea documentului
//     const newDocumentId = await createDocumentCopy(templateId, newTitle);
//     await setFilePermissions(newDocumentId);
//     console.log("start...3");

//     // Înlocuiește variabilele în documentul copiat
//     await replaceVariables(newDocumentId, variables);
//     console.log("start...4");

//     // Generează linkurile pentru export PDF și Word
//     const pdfLink = `https://docs.google.com/document/d/${newDocumentId}/export?format=pdf`;
//     const wordLink = `https://docs.google.com/document/d/${newDocumentId}/export?format=docx`;
//     console.log("start...5", pdfLink);

//     // Returnează link-urile într-un răspuns JSON
//     return NextResponse.json({ pdfLink, wordLink });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to generate document: " + error.message },
//       { status: 500 }
//     );
//   }
// }
