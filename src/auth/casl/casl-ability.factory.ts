import { Injectable } from '@nestjs/common';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';

import {
  PureAbility,
  AbilityBuilder,
  subject,
  ExtractSubjectType,
} from '@casl/ability';
import { User, Article } from '@prisma/client';
import { InferSubjects } from '@casl/ability';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type AppSubjects =
  | 'all'
  | Subjects<{
      User: User;
      Article: Article;
    }>;

export type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    if (user.isAdmin) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      // can(Action.Read, 'all'); // read-only access to everything
    }

    can(Action.Update, 'Article', { authorId: user.id });
    cannot(Action.Delete, 'Article', { isPublished: true });

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<InferSubjects<AppAbility>>,
    });
  }
}
