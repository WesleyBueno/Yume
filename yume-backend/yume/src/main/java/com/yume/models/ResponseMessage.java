package com.yume.models;

public class ResponseMessage {
    
    private String title;
    private String message;

    public ResponseMessage() {
    }

    public ResponseMessage(String title, String message) {
        this.title = title;
        this.message = message;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
