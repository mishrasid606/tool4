document.getElementById('merge-button').addEventListener('click', async () => {
    const fileInput1 = document.getElementById('file-input1');
    const fileInput2 = document.getElementById('file-input2');
    const output = document.getElementById('output');

    if (fileInput1.files.length === 0 && fileInput2.files.length === 0) {
        alert('Please select at least one PDF file from either section.');
        return;
    }

    try {
        const mergedPdf = await PDFLib.PDFDocument.create();

        const mergeFiles = async (fileInput) => {
            for (let i = 0; i < fileInput.files.length; i++) {
                const file = fileInput.files[i];
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());

                copiedPages.forEach((page) => {
                    mergedPdf.addPage(page);
                });
            }
        };

        await mergeFiles(fileInput1);
        await mergeFiles(fileInput2);

        const mergedPdfBytes = await mergedPdf.save();
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        output.innerHTML = `<a href="${url}" download="merged.pdf" class="btn btn-success btn-block">Download Merged PDF</a>`;
    } catch (error) {
        console.error('Error during PDF merging:', error);
        alert('An error occurred during PDF merging. Please check the console for details.');
    }
});
