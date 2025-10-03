package com.tictactoe.tictactoe.services;

import com.tictactoe.tictactoe.entity.HistoryModel;
import com.tictactoe.tictactoe.repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class HistoryServiceAction implements HistoryService {
    private HistoryRepository historyRepository;

    @Autowired
    public HistoryServiceAction(HistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    @Override
    public HistoryModel save(HistoryModel historyModel) {
        //validate
        return historyRepository.save(historyModel);
    }

    @Override
    public List<String> findHistoryListByToken(String token) {
        return historyRepository.findsHistoryListByToken(token);
    }

    @Override
    public HistoryModel findBoardStateById(String id) {
        return historyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("History not found with id: " + id));
    }

}
