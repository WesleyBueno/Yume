package com.yume.services;

import java.io.UnsupportedEncodingException;

import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
	@Qualifier("gmail")
	private JavaMailSender emailSender;

    public void enviarToken(String to, String subject, String body) {

		MimeMessage mail = emailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(mail);

		try {
			helper.setFrom(new InternetAddress("no-reply@yume.com", "Yume"));
			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(body, true);
            
            emailSender.send(mail);
		} catch (UnsupportedEncodingException | MessagingException e) {
			e.printStackTrace();
			return;
		}

	}
}
