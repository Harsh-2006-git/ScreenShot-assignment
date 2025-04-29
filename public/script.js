document.addEventListener('DOMContentLoaded', function() {
    const screenshotBtn = document.getElementById('screenshot-btn');
    
    screenshotBtn.addEventListener('click', async function() {
        try {
            // Show loading state
            screenshotBtn.textContent = 'Capturing...';
            screenshotBtn.disabled = true;
            
            // Call the backend endpoint to take a screenshot
            const response = await fetch('/api/screenshot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: window.location.href,
                    selector: '#infographic'
                })
            });
            
            if (!response.ok) {
                throw new Error('Screenshot capture failed');
            }
            
            // Get the screenshot as a blob
            const blob = await response.blob();
            
            // Create a download link
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'pinterest-marketing-infographic.png';
            
            // Trigger the download
            downloadLink.click();
            
            // Clean up
            URL.revokeObjectURL(downloadLink.href);
            
            // Reset button state
            screenshotBtn.textContent = 'Take Screenshot';
            screenshotBtn.disabled = false;
            
        } catch (error) {
            console.error('Error taking screenshot:', error);
            
            // Reset button state and show error
            screenshotBtn.textContent = 'Screenshot Failed';
            setTimeout(() => {
                screenshotBtn.textContent = 'Try Again';
                screenshotBtn.disabled = false;
            }, 2000);
        }
    });
});
