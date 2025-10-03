package com.tictactoe.tictactoe;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class TictactoeApplication {

	public static void main(String[] args) {
		SpringApplication.run(TictactoeApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(Environment env){
		return  runner -> {
			String port = env.getProperty("local.server.port", env.getProperty("server.port", "8080"));
			System.out.println("server is running on port: " + port);
		};
	}
}
