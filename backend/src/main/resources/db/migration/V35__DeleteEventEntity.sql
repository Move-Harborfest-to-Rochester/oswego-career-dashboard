ALTER TABLE task
    DROP FOREIGN KEY task_ibfk_2;

DROP TABLE event;

ALTER TABLE task
    MODIFY event_id BIGINT NULL;
