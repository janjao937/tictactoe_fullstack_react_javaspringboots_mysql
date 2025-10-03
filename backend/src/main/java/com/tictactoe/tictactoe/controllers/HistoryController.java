package com.tictactoe.tictactoe.controllers;

import com.tictactoe.tictactoe.entity.HistoryModel;
import com.tictactoe.tictactoe.services.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class HistoryController {
    private HistoryService historyService;

    @Autowired
    public HistoryController(HistoryService historyService)
    {
        this.historyService = historyService;
    }

    @GetMapping("/token")
    public ResponseEntity<String> getToken() {
        String token = UUID.randomUUID().toString();
        return ResponseEntity.ok(token);
    }
    @GetMapping("/history/{token}")
    public ResponseEntity<?> getHistoryListByToken(@PathVariable("token") String token) {
        try {
            List<String> list = historyService.findHistoryListByToken(token);
            return ResponseEntity.ok(list); // 200 OK
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body("Bad Request: " + e.getMessage()); // 400 Bad Request
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error: " + e.getMessage()); // 500
        }
    }
    @GetMapping("/history/state/{id}")
    public ResponseEntity<?> getBoardStateById(@PathVariable("id") String id) {
        try {
            HistoryModel board = historyService.findBoardStateById(id);
            if (board == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("History not found ID: " + id);
            }
            return ResponseEntity.ok(board);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error: " + e.getMessage());
        }
    }
    @PostMapping("/history")
    public ResponseEntity<?> insertHistory(@RequestBody HistoryModel history) {
        try {
            HistoryModel saved = historyService.save(history);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved); // 201 Created
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Bad Request: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error: " + e.getMessage()); // 500 Internal Server Error
        }
    }

}
