import { google } from "googleapis";
import { NextResponse } from "next/server";

// Creează autentificarea cu Google API folosind variabile de mediu
let auth;
try {
  console.log("Initializing auth...");
  auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL, // Citește din variabila de mediu
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Înlocuiește \\n cu newline
    },
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/documents",
    ],
  });
  console.log("Auth initialized successfully");
} catch (error) {
  console.error("Error during authentication:", error.message);
}

const drive = google.drive({ version: "v3", auth });
const docs = google.docs({ version: "v1", auth });

// Funcția pentru a seta permisiunile documentului generat
const setFilePermissions = async (fileId) => {
  try {
    // Setează permisiunile pentru o adresă de email specifică
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "user",
        emailAddress: "irp.isudb@gmail.com", // Setează adresa de email pentru permisiuni
      },
    });

    // Setează permisiuni publice (oricine cu link-ul)
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone", // Acces public
      },
    });

    console.log("Permissions set successfully");
  } catch (error) {
    console.error("Error setting permissions:", error.message);
  }
};

// Creează o copie a documentului model în Google Drive
const createDocumentCopy = async (templateId, newTitle) => {
  try {
    console.log("Creating document copy with templateId:", templateId);
    const copy = await drive.files.copy({
      fileId: templateId,
      requestBody: {
        name: newTitle, // Numele noului document
      },
    });
    return copy.data.id; // Returnează ID-ul noii copii a documentului
  } catch (error) {
    throw new Error("Error creating document copy: " + error.message);
  }
};

// Înlocuiește variabilele din documentul copiat
const replaceVariables = async (documentId, variables) => {
  const requests = Object.keys(variables).map((variable) => ({
    replaceAllText: {
      containsText: {
        text: `{{${variable}}}`, // Șablonul pentru variabilă (e.g. {{nume}})
        matchCase: true,
      },
      replaceText: variables[variable], // Textul care va înlocui variabila
    },
  }));

  await docs.documents.batchUpdate({
    documentId,
    requestBody: {
      requests,
    },
  });

  return documentId;
};

// Functie API pentru ruta de generare document
export async function POST(req) {
  try {
    console.log("Processing request to generate document...");
    const { templateId, variables, newTitle } = await req.json(); // Extrage datele din corpul cererii

    // Creează documentul nou din template și setează permisiunile
    const newDocumentId = await createDocumentCopy(templateId, newTitle);
    await setFilePermissions(newDocumentId);

    // Înlocuiește variabilele în documentul copiat
    await replaceVariables(newDocumentId, variables);

    // Generează linkurile pentru export PDF și Word
    const pdfLink = `https://docs.google.com/document/d/${newDocumentId}/export?format=pdf`;
    const wordLink = `https://docs.google.com/document/d/${newDocumentId}/export?format=docx`;

    console.log("Generated links:", { pdfLink, wordLink });

    // Returnează link-urile într-un răspuns JSON
    return NextResponse.json({ pdfLink, wordLink });
  } catch (error) {
    console.error("Failed to generate document:", error.message);
    return NextResponse.json(
      { error: "Failed to generate document: " + error.message },
      { status: 500 }
    );
  }
}
