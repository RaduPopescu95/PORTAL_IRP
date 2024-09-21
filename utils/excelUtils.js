export const appendRowToSheet = async (numar, dataCurenta, titlu) => {
    const url = 'https://google-spreadsheets.p.rapidapi.com/spreadsheet/1NO-NEAR2u2mM2RE1bChFZyFgD2Ohip-FByqs1Z-nXVg/sheet/0/add_rows';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': 'e2d1e9ffe0msha4608b476dc913cp12fb51jsnb2b21b5ced83',
            'X-RapidAPI-Host': 'google-spreadsheets.p.rapidapi.com'
        },
        body: JSON.stringify([[numar, dataCurenta, titlu]])

    };
    
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
};
