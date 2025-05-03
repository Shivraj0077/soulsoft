export async function sendAppointmentEmail(userEmail, appointmentDetails) {
  console.log('sendAppointmentEmail called with:', { userEmail, appointmentDetails });
  
  if (!userEmail) {
    console.error('Missing user email');
    return {
      success: false,
      message: 'User email is required',
    };
  }

  if (!appointmentDetails || !appointmentDetails.date || !appointmentDetails.time || !appointmentDetails.service) {
    console.error('Missing appointment details:', appointmentDetails);
    return {
      success: false,
      message: 'Complete appointment details are required',
    };
  }

  try {
    console.log('Sending request to API endpoint...');
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail,
        appointmentDetails,
      }),
    });
    
    console.log('API response status:', response.status);
    const data = await response.json();
    console.log('API response data:', data);
    
    return {
      success: response.ok,
      message: data.message || 'Email sent successfully',
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: 'Failed to send email: ' + error.message,
    };
  }
}