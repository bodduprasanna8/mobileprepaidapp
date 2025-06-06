package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendConfirmationEmail(String to, String mobileNumber, String planName, Double amount, String transactionId) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Mobile Prepaid Recharge Successful");
            message.setText("Dear Customer,\n\nYour recharge for mobile number " + mobileNumber +
                    " with plan " + planName + " amounting to " + amount +
                    " has been successful. Transaction ID: " + transactionId + "\n\n"
                    + "Your mobile services are now active with the latest plan benefits. "
                    + "Enjoy uninterrupted data, voice calls, and SMS. \n\n"
                    + "\nIf you have any questions or face any issues, our support team is here for you 24x7.\n"
                    + "contact: mobileprepaidapp@gmail.com"
                    + "\n\n\nThank you for choosing EasyPe for your mobile recharge."
                    + "\n\nWarm regards,\nTeam EasyPe");
            mailSender.send(message);
            System.out.println("Confirmation email sent to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send confirmation email to " + to + ": " + e.getMessage());
            e.printStackTrace();
            // Optionally: rethrow if you want the API to fail, or just log and continue
        }
    }
}