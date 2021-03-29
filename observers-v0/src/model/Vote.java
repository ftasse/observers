package com.observers.model;

import com.google.gson.annotations.Expose;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Cache
@EqualsAndHashCode(of="id", callSuper=false)
public class Vote extends Jsonifiable {
	
  @Expose
  public static String kind = "observers#vote";

  /**
   * @param id ID of Vote for which to get a Key.
   * @return Key representation of given Vote's ID.
   */
  public static Key<Vote> key(long id) {
    return Key.create(Vote.class, id);
  }

  /**
   * Primary identifier of this Vote.
   */
  @Id
  @Getter
  @Expose
  public Long id;

  /**
   * ID of User who owns this Vote.
   */
  @Index
  @Getter
  @Setter
  @Expose
  public Long ownerUserId;

  /**
   * ID of the Report to which this Vote was made.
   */
  @Index
  @Getter
  @Setter
  @Expose
  public Long reportId;
}
