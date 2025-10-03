package com.tictactoe.tictactoe.services;

import com.tictactoe.tictactoe.entity.HistoryModel;


import java.util.List;

public interface HistoryService {
    HistoryModel save(HistoryModel historyModel);
    List<String> findHistoryListByToken(String token);
    HistoryModel findBoardStateById(String id);
}
