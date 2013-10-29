package com.observers.model;

import static com.observers.model.OfyService.ofy;

import com.google.gson.annotations.Expose;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Cache
@EqualsAndHashCode(of="id", callSuper=false)
public class User extends Jsonifiable {
	
  @Expose
  public static String kind = "observers#user";

  /**
   * @param id ID of User for which to get a Key.
   * @return Key representation of given User's ID.
   */
  public static Key<User> key(long id) {
    return Key.create(User.class, id);
  }

  /**
   * Primary identifier of this User.  Specific to PhotoHunt.
   */
  @Id
  @Getter
  @Expose
  public Long id;

  /**
   * Primary email address of this User.
   */
  @Getter
  @Setter
  @Index
  @Expose
  public String email;

  /**
   * UUID identifier of this User within Google products.
   */
  @Getter
  @Setter
  @Index
  @Expose
  public String googleUserId;

  /**
   * Display name that this User has chosen for Google products.
   */
  @Getter
  @Setter
  @Index
  @Expose
  public String googleDisplayName;

  /**
   * Public Google+ profile URL for this User.
   */
  @Getter
  @Setter
  @Expose
  public String googlePublicProfileUrl;

  /**
   * Public Google+ profile image for this User.
   */
  @Getter
  @Setter
  @Expose
  public String googlePublicProfilePhotoUrl;

  /**
   * Access token used to access Google APIs on this User's behalf.
   */
  @Getter
  @Setter
  @Index
  public String googleAccessToken;

  /**
   * Refresh token used to refresh this User's googleAccessToken.
   */
  @Getter
  @Setter
  public String googleRefreshToken;

  /**
   * Validity of this User's googleAccessToken in seconds.
   */
  @Getter
  @Setter
  public Long googleExpiresIn;

  /**
   * Expiration time in milliseconds since Epoch for this User's
   * googleAccessToken.
   * Exposed for mobile clients, to help determine if they should request a new
   * token.
   */
  @Getter
  @Setter
  @Expose
  public Long googleExpiresAt;
}
