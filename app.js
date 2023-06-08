function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      // Generate HTML table from JSON data and display it
      const table = document.getElementById('excelTable');
      table.innerHTML = '';
  
      for (let i = 0; i < jsonData.length; i++) {
        const row = table.insertRow();
        for (let j = 0; j < jsonData[i].length; j++) {
          const cell = row.insertCell();
          cell.innerHTML = jsonData[i][j];
        }
      }
  
      // Enable download button
      const downloadButton = document.getElementById('downloadButton');
      downloadButton.disabled = false;
    };
  
    reader.readAsArrayBuffer(file);
  }
  
  // Attach event listener to file input element
  const fileInput = document.getElementById('excelFile');
  fileInput.addEventListener('change', handleFileUpload);
  
  // Function to handle form submission
  function handleFormSubmit(event) {
    event.preventDefault();
  
    // Get form inputs
    const productSelect = document.getElementById('productSelect');
    const serialNumberInput = document.getElementById('serialNumber');
    const voltageInput = document.getElementById('voltage');
    const warrantyInput = document.getElementById('warranty');
    const quantityInput = document.getElementById('quantity');
    const ratingInput = document.getElementById('rating');
  
    // Validate inputs
    if (serialNumberInput.value.trim() === '' || voltageInput.value.trim() === '' || warrantyInput.value.trim() === '' ||
      quantityInput.value.trim() === '' || ratingInput.value.trim() === '') {
      const errorContainer = document.getElementById('errorContainer');
      errorContainer.textContent = 'Please fill in all fields.';
      return;
    }
  
    // Create worksheet object
    const worksheet = XLSX.utils.json_to_sheet([{
      'Serial Number': serialNumberInput.value,
      'Voltage': voltageInput.value,
      'Warranty': warrantyInput.value,
      'Quantity': quantityInput.value,
      'Rating': ratingInput.value
    }]);
  
    // Get selected product value
    const selectedProduct = productSelect.value.toLowerCase();
  
    // Create workbook object
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedProduct);
  
    // Generate and download the modified Excel sheet
    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const downloadButton = document.getElementById('downloadButton');
    downloadButton.href = url;
    downloadButton.download = `${selectedProduct}_data.xlsx`;
  
    // Simulate click on download button to trigger download
    downloadButton.click();
  }
  
  // Attach event listener to form submission
  const form = document.getElementById('uploadForm');
  form.addEventListener('submit', handleFormSubmit);
  
