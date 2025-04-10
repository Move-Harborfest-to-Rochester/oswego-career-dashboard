package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Task;
import com.senior.project.backend.domain.TaskType;
import com.senior.project.backend.domain.YearLevel;
import com.senior.project.backend.event.LocalistService;
import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.util.NonBlockingExecutor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final CurrentUserUtil currentUserUtil;
    private final LocalistService localistService;

    public TaskService(TaskRepository taskRepository, CurrentUserUtil currentUserUtil, LocalistService localistService) {
        this.taskRepository = taskRepository;
        this.currentUserUtil = currentUserUtil;
        this.localistService = localistService;
    }

    /**
     * Gets all tasks
     */
    public Flux<Task> all() {
        return Flux.fromIterable(taskRepository.findAll());
    }

    /**
     * Updates a task using the provided map of updates
     * It assumes all updates will include id, name, location, and organizer since those are required
     *
     * @param id      task id
     * @param updates updated task data in the form of fieldName, fieldValue
     * @return the updated task
     */
    @Transactional
    public Mono<Task> updateTask(long id, Map<String, Object> updates) {
        Task existingTask = taskRepository.findById(id);

        existingTask.setSubmissionInstructions((String) updates.get("instructions"));

        if (updates.containsKey("description")) {
            existingTask.setDescription((String) updates.get("description"));
        }

        // updates technically should always have the task type
        if (updates.containsKey("taskType")) {
            TaskType taskType = TaskType.valueOf((String) updates.get("taskType"));
            // can't set the task type to artifact without providing an artifact name
            if (taskType.equals(TaskType.ARTIFACT) &&
                    updates.containsKey("artifactName")) {
                existingTask.setTaskType(taskType);
                existingTask.setEventId(null);    // if task was previously an event task, remove the event
            }
            // can't set the task type to event without providing an event
            else if (taskType.equals(TaskType.EVENT) &&
                    updates.containsKey("event")) {
                existingTask.setTaskType(taskType);
                existingTask.setArtifactName(null); // if the task was previously an artifact task, remove the artifact
            } else if (taskType.equals(TaskType.COMMENT)) {
                existingTask.setTaskType(taskType);
                existingTask.setArtifactName(null); // task previously was artifact/event, so remove that data
                existingTask.setEventId(null);
            }
        }

        // this is done in a separate step from the task type in case the type doesn't change
        if (updates.containsKey("artifactName") && existingTask.getTaskType() == TaskType.ARTIFACT) {
            existingTask.setArtifactName((String) updates.get("artifactName"));
        }
        // does not throw an event not found exception but still handles null events
        if (updates.containsKey("event") && existingTask.getTaskType().equals(TaskType.EVENT)) {
            Optional<Long> assignedEvent = Optional.of(Long.parseLong((String) updates.get("event")));
            assignedEvent.ifPresent(existingTask::setEventId);
        }

        return NonBlockingExecutor.execute(() -> taskRepository.save(existingTask));
    }

    /**
     * Gets a specific task by ID
     *
     * @return task object
     */
    public Mono<Task> findById(int id) {
        Task task = taskRepository.findById(id);
        return task == null ? Mono.empty() : Mono.just(task);
    }


    /**
     * Create a task using the provided map of data
     * It assumes all updates will include id, name, location, and organizer since those are required
     *
     * @param data task data in the form of fieldName, fieldValue
     * @return the new task
     */
    @Transactional
    public Mono<Task> createTask(Map<String, Object> data) {
        Task newTask = new Task();

        newTask.setName((String) data.get("name"));
        newTask.setYearLevel(YearLevel.valueOf((String) data.get("yearLevel")));
        newTask.setSubmissionInstructions((String) data.get("instructions"));

        if (data.containsKey("description")) {
            newTask.setDescription((String) data.get("description"));
        }

        TaskType taskType = TaskType.valueOf((String) data.get("taskType"));

        if (taskType.equals(TaskType.ARTIFACT)) {
            newTask.setTaskType(taskType);
            newTask.setArtifactName((String) data.get("artifactName"));
            newTask.setEventId(null);
        }
        // does not throw an event not found exception but still handles null events
        else if (taskType.equals(TaskType.EVENT)) {
            newTask.setTaskType(taskType);
            Optional<Long> eventId = Optional.of(Long.parseLong((String) data.get("event")));
            eventId.ifPresent(newTask::setEventId);
            newTask.setArtifactName(null);
        } else if (taskType.equals(TaskType.COMMENT)) {
            newTask.setTaskType(taskType);
            newTask.setArtifactName(null);
            newTask.setEventId(null);
        }

        return NonBlockingExecutor.execute(() -> taskRepository.save(newTask));
    }

    /**
     * Retrieves list of tasks for the homepage
     *
     * @param limit limit of tasks to return. limit for overdue tasks is half the limit
     * @return A Flux of upcoming tasks
     */
    public Flux<Task> homepage(int limit) {
        return currentUserUtil.getCurrentUser()
                .flatMapMany((user) -> {
                    var studentDetails = user.getStudentDetails();
                    if (studentDetails == null) {
                        return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Student Details not setup for user"));
                    }
                    return NonBlockingExecutor.executeMany(() -> {
                        int overdueLimit = limit / 2;
                        int upcomingLimit = limit - overdueLimit;
                        var previousYears = studentDetails.getYearLevel().previousYears();
                        var upcomingYears = studentDetails.getYearLevel().currentAndUpcomingYears();
                        var overdueTasks = taskRepository.findTasksToDisplayOnHomepage(previousYears, user.getId(), overdueLimit);
                        if (overdueTasks.size() != overdueLimit) {
                            upcomingLimit = limit - overdueTasks.size();
                        }
                        var upcomingTasks = taskRepository.findTasksToDisplayOnHomepage(upcomingYears, user.getId(), upcomingLimit);
                        overdueTasks.addAll(upcomingTasks);
                        return overdueTasks;
                    });
                });
    }
}
