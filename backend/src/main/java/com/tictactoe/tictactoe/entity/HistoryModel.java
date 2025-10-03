package com.tictactoe.tictactoe.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "history")
public class HistoryModel {

    @Id
    @Column(name = "id", columnDefinition = "CHAR(36)")
    private String id;

    @Column(nullable = false, columnDefinition = "CHAR(36)")
    private String token;

    @Column(nullable = false)
    private Integer size;

    @Column(name = "board_state", columnDefinition = "TEXT")
    private String boardState;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Date createdAt;

    public HistoryModel() {}

    public HistoryModel(String token, Integer size, String boardState) {
        this.token = token;
        this.size = size;
        this.boardState = boardState;
    }

    @PrePersist
    public void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        this.createdAt = new java.util.Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Integer getSize() { return size; }
    public void setSize(Integer size) { this.size = size; }

    public String getBoardState() { return boardState; }
    public void setBoardState(String boardState) { this.boardState = boardState; }

    public java.util.Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.util.Date createdAt) { this.createdAt = createdAt; }
}