package com.quiz.entity;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

public enum Level {
    EASY(0), MEDIUM(1), HARD(2);

    private static final Map<Integer, Level> lookup
            = new HashMap<>();

    static {
        for (Level w : EnumSet.allOf(Level.class))
            lookup.put(w.getCode(), w);
    }

    private final int code;

    Level(int code) {
        this.code = code;
    }

    public static Level get(int code) {
        return lookup.get(code);
    }

    public int getCode() {
        return code;
    }
}
