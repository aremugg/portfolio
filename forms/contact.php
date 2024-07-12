<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = $_POST['name'];
  $email = $_POST['email'];
  $subject = $_POST['subject'];
  $message = $_POST['message'];

  // Validate email
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Invalid email format";
    exit;
  }

  // Email settings
  $to = "farouk2127@gmail.com";
  $headers = "From: " . $email;
  $email_subject = "New contact form submission: " . $subject;
  $email_body = "You have received a new message from the user $name.\n".
                "Here is the message:\n$message";

  // Send email
  if (mail($to, $email_subject, $email_body, $headers)) {
    echo "Message sent successfully!";
  } else {
    echo "Failed to send message.";
  }
} else {
  echo "Invalid request method.";
}
?>