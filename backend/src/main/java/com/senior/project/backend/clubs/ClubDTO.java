package com.senior.project.backend.clubs;

import com.senior.project.backend.validation.PastOrPresentDate;
import java.util.Date;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Generated
public class ClubDTO {
  private UUID id;
  private String name;
  @PastOrPresentDate(message = "startDate must not be in the future.")
  private Date startDate;
  @PastOrPresentDate(message = "endDate must not be in the future.")
  private Date endDate;

}
