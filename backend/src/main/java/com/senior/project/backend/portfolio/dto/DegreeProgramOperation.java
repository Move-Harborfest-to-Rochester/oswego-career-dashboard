package com.senior.project.backend.portfolio.dto;

import com.senior.project.backend.domain.DegreeProgram;
import com.senior.project.backend.domain.StudentDetails;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Generated
public class DegreeProgramOperation {
    @Enumerated(EnumType.STRING)
    OperationType operation;
    UUID id;
    String name;
    Boolean isMinor;

    public DegreeProgram toDegreeProgram(StudentDetails studentDetails) {
        DegreeProgram degreeProgram = new DegreeProgram();
        degreeProgram.setId(this.id);
        degreeProgram.setName(this.name);
        degreeProgram.setMinor(this.isMinor);
        degreeProgram.setStudentDetails(studentDetails);
        return degreeProgram;
    }
}