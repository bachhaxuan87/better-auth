import { APIError, type Context, createEndpointCreator } from "better-call";
import type { Session, User } from "../../adapters/schema";
import { createAuthMiddleware, optionsMiddleware } from "../../api/call";
import { sessionMiddleware } from "../../api/middlewares/session";
import type { Role, defaultRoles } from "./access";
import type { OrganizationOptions } from "./organization";

export const orgMiddleware = createAuthMiddleware(async (ctx) => {
	return {} as {
		orgOptions: OrganizationOptions;
		roles: typeof defaultRoles & {
			[key: string]: Role<{}>;
		};
		getSession: (context: Context<any, any>) => Promise<{
			session: Session & {
				activeOrganizationId?: string;
			};
			user: User;
		}>;
	};
});

export const orgSessionMiddleware = createAuthMiddleware(
	{
		use: [sessionMiddleware],
	},
	async (ctx) => {
		//@ts-expect-error: fix this later on better-call repo. Session middleware will return session in the context.
		const session = ctx.context.session as {
			session: Session & {
				activeOrganizationId?: string;
			};
			user: User;
		};
		return {
			session,
		};
	},
);