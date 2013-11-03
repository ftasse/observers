package com.observers.model;

import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;

public class OfyService {
  // Register all models with Objectify.

  static {
    factory().register(Category.class);
    factory().register(Report.class);
    factory().register(Channel.class);
    factory().register(TwitterAccount.class);
    factory().register(FacebookAccount.class);
    factory().register(User.class);
    factory().register(Topic.class);
    factory().register(Vote.class);
  }

  /**
   * @return Objectify instance to use for datastore interaction.
   */
  public static Objectify ofy() {
    return ObjectifyService.ofy();
  }

  /**
   * @return Factory for Objectify instances.
   */
  public static ObjectifyFactory factory() {
    return ObjectifyService.factory();
  }
}
