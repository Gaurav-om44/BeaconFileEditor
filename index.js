document.getElementById('fileForm').addEventListener('submit', function (event) {
    event.preventDefault();  // Prevent form from submitting in the usual way

    const sourceFileInput = document.getElementById('sourceFile');
    const targetFileInput = document.getElementById('targetFile');
    const statusElement = document.getElementById('status');

    if (sourceFileInput.files.length === 0 || targetFileInput.files.length === 0) {
        statusElement.textContent = 'Please select both source and target files.';
        return;
    }

    const sourceFile = sourceFileInput.files[0];
    const targetFile = targetFileInput.files[0];

    // Display a loading message
    statusElement.textContent = 'Processing files...';

    // FileReader to read the files
    const reader = new FileReader();
    
    reader.onload = function (event) {
        const sourceContent = event.target.result;
        
        // Now we load the target file using another FileReader
        const reader2 = new FileReader();
        
        reader2.onload = function (event2) {
            const targetContent = event2.target.result;

            // Call function to replace fields and write back to the target file
            const newContent = replaceFields(sourceContent, targetContent);

            // Trigger file download of the updated target file
            downloadFile(targetFile.name, newContent);

            // Update status
            statusElement.textContent = 'Fields replaced successfully!';
        };

        reader2.readAsText(targetFile);
    };

    reader.readAsText(sourceFile);
});

function replaceFields(sourceContent, targetContent) {
    const sourceLines = sourceContent.split('\n');
    const targetLines = targetContent.split('\n');

    // Extract fields based on specific positions
    const field1 = sourceLines[0].substring(16, 34).trim();  // Line 1, col 17 to 31
    const field2 = sourceLines[1].substring(5, 42).trim();   // Line 2, col 6 to 43
    const field3 = sourceLines[2].substring(16, 41).trim();  // Line 3, col 17 to 41

    // Additional fields as per your new request
    const field4 = sourceLines[0].substring(24, 34).trim();  // Line 1, col 25 to 35
    const field5 = sourceLines[1].substring(5, 17).trim();   // Line 2, col 6 to 43

    //field from frontEnd

    const field6 = String(document.getElementById("FirstName").value)
    const field7 = String(document.getElementById("LastName").value)
    

    // Replace the corresponding fields in the target content
    targetLines[0] = targetLines[0].substring(0, 16) + field1 + targetLines[0].substring(33);
    targetLines[1] = targetLines[1].substring(0, 8) + field2 + targetLines[1].substring(45);
    targetLines[2] = targetLines[2].substring(0, 16) + field3 + targetLines[2].substring(41);

    // Additional replacements for new target positions
    targetLines[1] = targetLines[1].substring(0, 248) + field4 + targetLines[1].substring(257);  // Line 2, col 249 to 258
    targetLines[1] = targetLines[1].substring(0, 1555) + field5 + targetLines[1].substring(1568);  // Line 2, col 1555 to 1566

    //Replacements from front end
    targetLines[1] = targetLines[1].substring(0,632) + field7 + targetLines[1].substring(field7.length + 632);
    targetLines[1] = targetLines[1].substring(0,672) + field6 + targetLines[1].substring(field6.length + 672);
    

    return targetLines.join('\n');
}

function downloadFile(filename, content) {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });

    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);  // Required for this to work in FireFox
    element.click();
}