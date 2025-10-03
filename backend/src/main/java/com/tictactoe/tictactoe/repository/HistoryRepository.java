package com.tictactoe.tictactoe.repository;

import com.tictactoe.tictactoe.entity.HistoryModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;


public interface HistoryRepository extends JpaRepository<HistoryModel,String> {
    @Query("SELECT h.id FROM HistoryModel h WHERE h.token = :token ORDER BY h.createdAt ASC")
    List<String> findsHistoryListByToken(@Param("token") String token);
}
