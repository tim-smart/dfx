/* eslint-disable */
import type * as HttpClient from "@effect/platform/HttpClient"
import * as HttpClientError from "@effect/platform/HttpClientError"
import * as HttpClientRequest from "@effect/platform/HttpClientRequest"
import * as HttpClientResponse from "@effect/platform/HttpClientResponse"
import * as UrlParams from "@effect/platform/UrlParams"
import * as Data from "effect/Data"
import * as Effect from "effect/Effect"

export type SnowflakeType = string

export type ApplicationTypes = 4

export type Int53Type = number

export interface UserAvatarDecorationResponse {
  readonly asset: string
  readonly sku_id?: null | SnowflakeType
}

export type NameplatePalette = string

export interface UserNameplateResponse {
  readonly sku_id?: null | SnowflakeType
  readonly asset?: string | null
  readonly label?: string | null
  readonly palette?: null | NameplatePalette
}

export interface UserCollectiblesResponse {
  readonly nameplate?: null | UserNameplateResponse
}

export interface UserPrimaryGuildResponse {}

export interface UserResponse {
  readonly id: SnowflakeType
  readonly username: string
  readonly avatar?: string | null
  readonly discriminator: string
  readonly public_flags: number
  readonly flags: Int53Type
  readonly bot?: boolean | null
  readonly system?: boolean | null
  readonly banner?: string | null
  readonly accent_color?: number | null
  readonly global_name?: string | null
  readonly avatar_decoration_data?: null | UserAvatarDecorationResponse
  readonly collectibles?: null | UserCollectiblesResponse
  readonly clan?: null | UserPrimaryGuildResponse
}

export const OAuth2Scopes = {
  /** allows /users/@me without email */
  IDENTIFY: "identify",
  /** enables /users/@me to return an email */
  EMAIL: "email",
  /** allows /users/@me/connections to return linked third-party accounts */
  CONNECTIONS: "connections",
  /** allows /users/@me/guilds to return basic information about all of a user's guilds */
  GUILDS: "guilds",
  /** allows /guilds/{guild.id}/members/{user.id} to be used for joining users to a guild */
  GUILDS_JOIN: "guilds.join",
  /** allows /users/@me/guilds/{guild.id}/member to return a user's member information in a guild */
  GUILDS_MEMBERS_READ: "guilds.members.read",
  /** allows your app to join users to a group dm */
  GDM_JOIN: "gdm.join",
  /** for oauth2 bots, this puts the bot in the user's selected guild by default */
  BOT: "bot",
  /** for local rpc server access, this allows you to control a user's local Discord client - requires Discord approval */
  RPC: "rpc",
  /** for local rpc server access, this allows you to receive notifications pushed out to the user - requires Discord approval */
  RPC_NOTIFICATIONS_READ: "rpc.notifications.read",
  /** for local rpc server access, this allows you to read a user's voice settings and listen for voice events - requires Discord approval */
  RPC_VOICE_READ: "rpc.voice.read",
  /** for local rpc server access, this allows you to update a user's voice settings - requires Discord approval */
  RPC_VOICE_WRITE: "rpc.voice.write",
  /** for local rpc server access, this allows you to read a user's video status - requires Discord approval */
  RPC_VIDEO_READ: "rpc.video.read",
  /** for local rpc server access, this allows you to update a user's video settings - requires Discord approval */
  RPC_VIDEO_WRITE: "rpc.video.write",
  /** for local rpc server access, this allows you to read a user's screenshare status- requires Discord approval */
  RPC_SCREENSHARE_READ: "rpc.screenshare.read",
  /** for local rpc server access, this allows you to update a user's screenshare settings- requires Discord approval */
  RPC_SCREENSHARE_WRITE: "rpc.screenshare.write",
  /** for local rpc server access, this allows you to update a user's activity - requires Discord approval */
  RPC_ACTIVITIES_WRITE: "rpc.activities.write",
  /** this generates a webhook that is returned in the oauth token response for authorization code grants */
  WEBHOOK_INCOMING: "webhook.incoming",
  /** for local rpc server api access, this allows you to read messages from all client channels (otherwise restricted to channels/guilds your app creates) */
  MESSAGES_READ: "messages.read",
  /** allows your app to upload/update builds for a user's applications - requires Discord approval */
  APPLICATIONS_BUILDS_UPLOAD: "applications.builds.upload",
  /** allows your app to read build data for a user's applications */
  APPLICATIONS_BUILDS_READ: "applications.builds.read",
  /** allows your app to use commands in a guild */
  APPLICATIONS_COMMANDS: "applications.commands",
  /** allows your app to update permissions for its commands in a guild a user has permissions to */
  APPLICATIONS_COMMANDS_PERMISSIONS_UPDATE:
    "applications.commands.permissions.update",
  /** allows your app to update its commands using a Bearer token - client credentials grant only */
  APPLICATIONS_COMMANDS_UPDATE: "applications.commands.update",
  /** allows your app to read and update store data (SKUs, store listings, achievements, etc.) for a user's applications */
  APPLICATIONS_STORE_UPDATE: "applications.store.update",
  /** allows your app to read entitlements for a user's applications */
  APPLICATIONS_ENTITLEMENTS: "applications.entitlements",
  /** allows your app to fetch data from a user's "Now Playing/Recently Played" list - requires Discord approval */
  ACTIVITIES_READ: "activities.read",
  /** allows your app to update a user's activity - requires Discord approval (NOT REQUIRED FOR GAMESDK ACTIVITY MANAGER) */
  ACTIVITIES_WRITE: "activities.write",
  /** allows your app to send activity invites - requires Discord approval (NOT REQUIRED FOR GAMESDK ACTIVITY MANAGER) */
  ACTIVITIES_INVITES_WRITE: "activities.invites.write",
  /** allows your app to know a user's friends and implicit relationships - requires Discord approval */
  RELATIONSHIPS_READ: "relationships.read",
  /** allows your app to connect to voice on user's behalf and see all the voice members - requires Discord approval */
  VOICE: "voice",
  /** allows your app to see information about the user's DMs and group DMs - requires Discord approval */
  DM_CHANNELS_READ: "dm_channels.read",
  /** allows your app to update a user's connection and metadata for the app */
  ROLE_CONNECTIONS_WRITE: "role_connections.write",
  /** for OpenID Connect, this allows your app to receive user id and basic profile information */
  OPENID: "openid",
} as const
export type OAuth2Scopes = (typeof OAuth2Scopes)[keyof typeof OAuth2Scopes]

export interface ApplicationOAuth2InstallParamsResponse {
  readonly scopes: ReadonlyArray<"applications.commands" | "bot">
  readonly permissions: string
}

export const ApplicationExplicitContentFilterTypes = {
  /** inherit guild content filter setting */
  INHERIT: 0,
  /** interactions will always be scanned */
  ALWAYS: 1,
} as const
export type ApplicationExplicitContentFilterTypes =
  (typeof ApplicationExplicitContentFilterTypes)[keyof typeof ApplicationExplicitContentFilterTypes]

export const TeamMembershipStates = {
  /** User has been invited to the team. */
  INVITED: 1,
  /** User has accepted the team invitation. */
  ACCEPTED: 2,
} as const
export type TeamMembershipStates =
  (typeof TeamMembershipStates)[keyof typeof TeamMembershipStates]

export interface TeamMemberResponse {
  readonly user: UserResponse
  readonly team_id: SnowflakeType
  readonly membership_state: TeamMembershipStates
}

export interface TeamResponse {
  readonly id: SnowflakeType
  readonly icon?: string | null
  readonly name: string
  readonly owner_user_id: SnowflakeType
  readonly members: ReadonlyArray<TeamMemberResponse>
}

export interface PrivateApplicationResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly icon?: string | null
  readonly description: string
  readonly type?: null | ApplicationTypes
  readonly cover_image?: string | null
  readonly primary_sku_id?: null | SnowflakeType
  readonly bot?: null | UserResponse
  readonly slug?: string | null
  readonly guild_id?: null | SnowflakeType
  readonly rpc_origins?: ReadonlyArray<string> | null
  readonly bot_public?: boolean | null
  readonly bot_require_code_grant?: boolean | null
  readonly terms_of_service_url?: string | null
  readonly privacy_policy_url?: string | null
  readonly custom_install_url?: string | null
  readonly install_params?: null | ApplicationOAuth2InstallParamsResponse
  readonly integration_types_config?: Record<string, unknown> | null
  readonly verify_key: string
  readonly flags: number
  readonly max_participants?: number | null
  readonly tags?: ReadonlyArray<string> | null
  readonly redirect_uris: ReadonlyArray<string>
  readonly interactions_endpoint_url?: string | null
  readonly role_connections_verification_url?: string | null
  readonly owner: UserResponse
  readonly approximate_guild_count?: number | null
  readonly approximate_user_install_count: number
  readonly explicit_content_filter: ApplicationExplicitContentFilterTypes
  readonly team?: null | TeamResponse
}

export interface ApplicationOAuth2InstallParams {
  readonly scopes?: ReadonlyArray<"applications.commands" | "bot"> | null
  readonly permissions?: number | null
}

export interface ApplicationFormPartial {
  readonly description?: {
    readonly default: string
    readonly localizations?: Record<string, unknown> | null
  } | null
  readonly icon?: string | null
  readonly cover_image?: string | null
  readonly team_id?: null | SnowflakeType
  readonly flags?: number | null
  readonly interactions_endpoint_url?: string | null
  readonly explicit_content_filter?: null | ApplicationExplicitContentFilterTypes
  readonly max_participants?: number | null
  readonly type?: null | ApplicationTypes
  readonly tags?: ReadonlyArray<string> | null
  readonly custom_install_url?: string | null
  readonly install_params?: null | ApplicationOAuth2InstallParams
  readonly role_connections_verification_url?: string | null
  readonly integration_types_config?: Record<string, unknown> | null
}

export const EmbeddedActivityLocationKind = {
  /** guild channel */
  GUILD_CHANNEL: "gc",
  /** private channel */
  PRIVATE_CHANNEL: "pc",
} as const
export type EmbeddedActivityLocationKind =
  (typeof EmbeddedActivityLocationKind)[keyof typeof EmbeddedActivityLocationKind]

export interface GuildChannelLocation {
  readonly id: string
  readonly kind: "gc"
  readonly channel_id: SnowflakeType
  readonly guild_id: SnowflakeType
}

export interface PrivateChannelLocation {
  readonly id: string
  readonly kind: "pc"
  readonly channel_id: SnowflakeType
}

export interface EmbeddedActivityInstance {
  readonly application_id: SnowflakeType
  readonly instance_id: string
  readonly launch_id: string
  readonly location?: GuildChannelLocation | PrivateChannelLocation | null
  readonly users: ReadonlyArray<SnowflakeType>
}

export interface ApplicationResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly icon?: string | null
  readonly description: string
  readonly type?: null | ApplicationTypes
  readonly cover_image?: string | null
  readonly primary_sku_id?: null | SnowflakeType
  readonly bot?: null | UserResponse
  readonly slug?: string | null
  readonly guild_id?: null | SnowflakeType
  readonly rpc_origins?: ReadonlyArray<string> | null
  readonly bot_public?: boolean | null
  readonly bot_require_code_grant?: boolean | null
  readonly terms_of_service_url?: string | null
  readonly privacy_policy_url?: string | null
  readonly custom_install_url?: string | null
  readonly install_params?: null | ApplicationOAuth2InstallParamsResponse
  readonly integration_types_config?: Record<string, unknown> | null
  readonly verify_key: string
  readonly flags: number
  readonly max_participants?: number | null
  readonly tags?: ReadonlyArray<string> | null
}

export interface AttachmentResponse {
  readonly id: SnowflakeType
  readonly filename: string
  readonly size: number
  readonly url: string
  readonly proxy_url: string
  readonly width?: number | null
  readonly height?: number | null
  readonly duration_secs?: number | null
  readonly waveform?: string | null
  readonly description?: string | null
  readonly content_type?: string | null
  readonly ephemeral?: boolean | null
  readonly title?: string | null
  readonly application?: null | ApplicationResponse
  readonly clip_created_at?: string | null
  readonly clip_participants?: ReadonlyArray<UserResponse> | null
}

export interface ActivitiesAttachmentResponse {
  readonly attachment: AttachmentResponse
}

export interface ListApplicationCommandsParams {
  readonly with_localizations?: boolean
}

export const ApplicationCommandType = {
  /** Slash commands; a text-based command that shows up when a user types / */
  CHAT: 1,
  /** A UI-based command that shows up when you right click or tap on a user */
  USER: 2,
  /** A UI-based command that shows up when you right click or tap on a message */
  MESSAGE: 3,
  /** A command that represents the primary way to use an application (e.g. launching an Activity) */
  PRIMARY_ENTRY_POINT: 4,
} as const
export type ApplicationCommandType =
  (typeof ApplicationCommandType)[keyof typeof ApplicationCommandType]

export const InteractionContextType = {
  /** This command can be used within a Guild. */
  GUILD: 0,
  /** This command can be used within a DM with this application's bot. */
  BOT_DM: 1,
  /** This command can be used within DMs and Group DMs with users. */
  PRIVATE_CHANNEL: 2,
} as const
export type InteractionContextType =
  (typeof InteractionContextType)[keyof typeof InteractionContextType]

export const ApplicationIntegrationType = {
  /** For Guild install. */
  GUILD_INSTALL: 0,
  /** For User install. */
  USER_INSTALL: 1,
} as const
export type ApplicationIntegrationType =
  (typeof ApplicationIntegrationType)[keyof typeof ApplicationIntegrationType]

export const ApplicationCommandOptionType = {
  /** A sub-action within a command or group */
  SUB_COMMAND: 1,
  /** A group of subcommands */
  SUB_COMMAND_GROUP: 2,
  /** A string option */
  STRING: 3,
  /** An integer option. Any integer between -2^53 and 2^53 is a valid value */
  INTEGER: 4,
  /** A boolean option */
  BOOLEAN: 5,
  /** A snowflake option that represents a User */
  USER: 6,
  /** A snowflake option that represents a Channel. Includes all channel types and categories */
  CHANNEL: 7,
  /** A snowflake option that represents a Role */
  ROLE: 8,
  /** A snowflake option that represents anything you can mention */
  MENTIONABLE: 9,
  /** A number option. Any double between -2^53 and 2^53 is a valid value */
  NUMBER: 10,
  /** An attachment option */
  ATTACHMENT: 11,
} as const
export type ApplicationCommandOptionType =
  (typeof ApplicationCommandOptionType)[keyof typeof ApplicationCommandOptionType]

export interface ApplicationCommandAttachmentOptionResponse {
  readonly type: 11
  readonly name: string
  readonly name_localized?: string | null
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localized?: string | null
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
}

export interface ApplicationCommandBooleanOptionResponse {
  readonly type: 5
  readonly name: string
  readonly name_localized?: string | null
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localized?: string | null
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
}

export const ChannelTypes = {
  /** A direct message between users */
  DM: 1,
  /** A direct message between multiple users */
  GROUP_DM: 3,
  /** A text channel within a server */
  GUILD_TEXT: 0,
  /** A voice channel within a server */
  GUILD_VOICE: 2,
  /** An organizational category that contains up to 50 channels */
  GUILD_CATEGORY: 4,
  /** A channel that users can follow and crosspost into their own server (formerly news channels) */
  GUILD_ANNOUNCEMENT: 5,
  /** A temporary sub-channel within a GUILD_ANNOUNCEMENT channel */
  ANNOUNCEMENT_THREAD: 10,
  /** A temporary sub-channel within a GUILD_TEXT or GUILD_THREADS_ONLY channel type set */
  PUBLIC_THREAD: 11,
  /** A temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission */
  PRIVATE_THREAD: 12,
  /** A voice channel for hosting events with an audience */
  GUILD_STAGE_VOICE: 13,
  /** The channel in a hub containing the listed servers */
  GUILD_DIRECTORY: 14,
  /** Channel that can only contain threads */
  GUILD_FORUM: 15,
} as const
export type ChannelTypes = (typeof ChannelTypes)[keyof typeof ChannelTypes]

export interface ApplicationCommandChannelOptionResponse {
  readonly type: 7
  readonly name: string
  readonly name_localized?: string | null
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localized?: string | null
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
  readonly channel_types?: ReadonlyArray<ChannelTypes> | null
}

export interface ApplicationCommandOptionIntegerChoiceResponse {
  readonly name: string
  readonly name_localized?: string | null
  readonly name_localizations?: Record<string, unknown> | null
  readonly value: Int53Type
}

export interface ApplicationCommandIntegerOptionResponse {
  readonly type: 4
  readonly name: string
  readonly name_localized?: string | null
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localized?: string | null
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
  readonly autocomplete?: boolean | null
  readonly choices?: ReadonlyArray<ApplicationCommandOptionIntegerChoiceResponse> | null
  readonly min_value?: null | Int53Type
  readonly max_value?: null | Int53Type
}

export interface ApplicationCommandMentionableOptionResponse {
  readonly type: 9
  readonly name: string
  readonly name_localized?: string | null
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localized?: string | null
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
}

export interface ApplicationCommandOptionNumberChoiceResponse {
  readonly name: string
  readonly name_localized?: string | null
  readonly name_localizations?: Record<string, unknown> | null
  readonly value: number
}

export interface ApplicationCommandNumberOptionResponse {
  readonly type: 10
  readonly name: string
  readonly name_localized?: string | null
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localized?: string | null
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
  readonly autocomplete?: boolean | null
  readonly choices?: ReadonlyArray<ApplicationCommandOptionNumberChoiceResponse> | null
  readonly min_value?: number | null
  readonly max_value?: number | null
}

export interface ApplicationCommandRoleOptionResponse {
  readonly type: 8
  readonly name: string
  readonly name_localized?: string | null
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localized?: string | null
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
}

export interface ApplicationCommandOptionStringChoiceResponse {
  readonly name: string
  readonly name_localized?: string | null
  readonly name_localizations?: Record<string, unknown> | null
  readonly value: string
}

export interface ApplicationCommandStringOptionResponse {
  readonly type: 3
  readonly name: string
  readonly name_localized?: string | null
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localized?: string | null
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
  readonly autocomplete?: boolean | null
  readonly choices?: ReadonlyArray<ApplicationCommandOptionStringChoiceResponse> | null
  readonly min_length?: number | null
  readonly max_length?: number | null
}

export interface ApplicationCommandUserOptionResponse {
  readonly type: 6
  readonly name: string
  readonly name_localized?: string | null
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localized?: string | null
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
}

export interface ApplicationCommandSubcommandOptionResponse {
  readonly type: 1
  readonly name: string
  readonly name_localized?: string | null
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localized?: string | null
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
  readonly options?: ReadonlyArray<
    | ApplicationCommandAttachmentOptionResponse
    | ApplicationCommandBooleanOptionResponse
    | ApplicationCommandChannelOptionResponse
    | ApplicationCommandIntegerOptionResponse
    | ApplicationCommandMentionableOptionResponse
    | ApplicationCommandNumberOptionResponse
    | ApplicationCommandRoleOptionResponse
    | ApplicationCommandStringOptionResponse
    | ApplicationCommandUserOptionResponse
  > | null
}

export interface ApplicationCommandSubcommandGroupOptionResponse {
  readonly type: 2
  readonly name: string
  readonly name_localized?: string | null
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localized?: string | null
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
  readonly options?: ReadonlyArray<ApplicationCommandSubcommandOptionResponse> | null
}

export interface ApplicationCommandResponse {
  readonly id: SnowflakeType
  readonly application_id: SnowflakeType
  readonly version: SnowflakeType
  readonly default_member_permissions?: string | null
  readonly type: ApplicationCommandType
  readonly name: string
  readonly name_localized?: string | null
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localized?: string | null
  readonly description_localizations?: Record<string, unknown> | null
  readonly guild_id?: null | SnowflakeType
  readonly dm_permission?: boolean | null
  readonly contexts?: ReadonlyArray<InteractionContextType> | null
  readonly integration_types?: ReadonlyArray<ApplicationIntegrationType> | null
  readonly options?: ReadonlyArray<
    | ApplicationCommandAttachmentOptionResponse
    | ApplicationCommandBooleanOptionResponse
    | ApplicationCommandChannelOptionResponse
    | ApplicationCommandIntegerOptionResponse
    | ApplicationCommandMentionableOptionResponse
    | ApplicationCommandNumberOptionResponse
    | ApplicationCommandRoleOptionResponse
    | ApplicationCommandStringOptionResponse
    | ApplicationCommandSubcommandGroupOptionResponse
    | ApplicationCommandSubcommandOptionResponse
    | ApplicationCommandUserOptionResponse
  > | null
  readonly nsfw?: boolean | null
}

export type ListApplicationCommands200 =
  ReadonlyArray<ApplicationCommandResponse>

export interface ApplicationCommandAttachmentOption {
  readonly type: 11
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
}

export interface ApplicationCommandBooleanOption {
  readonly type: 5
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
}

export interface ApplicationCommandChannelOption {
  readonly type: 7
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
  readonly channel_types?: ReadonlyArray<ChannelTypes> | null
}

export interface ApplicationCommandOptionIntegerChoice {
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly value: Int53Type
}

export interface ApplicationCommandIntegerOption {
  readonly type: 4
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
  readonly autocomplete?: boolean | null
  readonly choices?: ReadonlyArray<ApplicationCommandOptionIntegerChoice> | null
  readonly min_value?: null | Int53Type
  readonly max_value?: null | Int53Type
}

export interface ApplicationCommandMentionableOption {
  readonly type: 9
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
}

export interface ApplicationCommandOptionNumberChoice {
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly value: number
}

export interface ApplicationCommandNumberOption {
  readonly type: 10
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
  readonly autocomplete?: boolean | null
  readonly choices?: ReadonlyArray<ApplicationCommandOptionNumberChoice> | null
  readonly min_value?: number | null
  readonly max_value?: number | null
}

export interface ApplicationCommandRoleOption {
  readonly type: 8
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
}

export interface ApplicationCommandOptionStringChoice {
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly value: string
}

export interface ApplicationCommandStringOption {
  readonly type: 3
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
  readonly autocomplete?: boolean | null
  readonly min_length?: number | null
  readonly max_length?: number | null
  readonly choices?: ReadonlyArray<ApplicationCommandOptionStringChoice> | null
}

export interface ApplicationCommandUserOption {
  readonly type: 6
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
}

export interface ApplicationCommandSubcommandOption {
  readonly type: 1
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
  readonly options?: ReadonlyArray<
    | ApplicationCommandAttachmentOption
    | ApplicationCommandBooleanOption
    | ApplicationCommandChannelOption
    | ApplicationCommandIntegerOption
    | ApplicationCommandMentionableOption
    | ApplicationCommandNumberOption
    | ApplicationCommandRoleOption
    | ApplicationCommandStringOption
    | ApplicationCommandUserOption
  > | null
}

export interface ApplicationCommandSubcommandGroupOption {
  readonly type: 2
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localizations?: Record<string, unknown> | null
  readonly required?: boolean | null
  readonly options?: ReadonlyArray<ApplicationCommandSubcommandOption> | null
}

export type ApplicationCommandHandler = number

export interface ApplicationCommandUpdateRequest {
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly description?: string | null
  readonly description_localizations?: Record<string, unknown> | null
  readonly options?: ReadonlyArray<
    | ApplicationCommandAttachmentOption
    | ApplicationCommandBooleanOption
    | ApplicationCommandChannelOption
    | ApplicationCommandIntegerOption
    | ApplicationCommandMentionableOption
    | ApplicationCommandNumberOption
    | ApplicationCommandRoleOption
    | ApplicationCommandStringOption
    | ApplicationCommandSubcommandGroupOption
    | ApplicationCommandSubcommandOption
    | ApplicationCommandUserOption
  > | null
  readonly default_member_permissions?: number | null
  readonly dm_permission?: boolean | null
  readonly contexts?: ReadonlyArray<InteractionContextType> | null
  readonly integration_types?: ReadonlyArray<ApplicationIntegrationType> | null
  readonly handler?: null | ApplicationCommandHandler
  readonly type?: null | ApplicationCommandType
  readonly id?: null | SnowflakeType
}

export type BulkSetApplicationCommandsRequest =
  ReadonlyArray<ApplicationCommandUpdateRequest>

export type BulkSetApplicationCommands200 =
  ReadonlyArray<ApplicationCommandResponse>

export interface ApplicationCommandCreateRequest {
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly description?: string | null
  readonly description_localizations?: Record<string, unknown> | null
  readonly options?: ReadonlyArray<
    | ApplicationCommandAttachmentOption
    | ApplicationCommandBooleanOption
    | ApplicationCommandChannelOption
    | ApplicationCommandIntegerOption
    | ApplicationCommandMentionableOption
    | ApplicationCommandNumberOption
    | ApplicationCommandRoleOption
    | ApplicationCommandStringOption
    | ApplicationCommandSubcommandGroupOption
    | ApplicationCommandSubcommandOption
    | ApplicationCommandUserOption
  > | null
  readonly default_member_permissions?: number | null
  readonly dm_permission?: boolean | null
  readonly contexts?: ReadonlyArray<InteractionContextType> | null
  readonly integration_types?: ReadonlyArray<ApplicationIntegrationType> | null
  readonly handler?: null | ApplicationCommandHandler
  readonly type?: null | ApplicationCommandType
}

export interface ApplicationCommandPatchRequestPartial {
  readonly name?: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly description?: string | null
  readonly description_localizations?: Record<string, unknown> | null
  readonly options?: ReadonlyArray<
    | ApplicationCommandAttachmentOption
    | ApplicationCommandBooleanOption
    | ApplicationCommandChannelOption
    | ApplicationCommandIntegerOption
    | ApplicationCommandMentionableOption
    | ApplicationCommandNumberOption
    | ApplicationCommandRoleOption
    | ApplicationCommandStringOption
    | ApplicationCommandSubcommandGroupOption
    | ApplicationCommandSubcommandOption
    | ApplicationCommandUserOption
  > | null
  readonly default_member_permissions?: number | null
  readonly dm_permission?: boolean | null
  readonly contexts?: ReadonlyArray<InteractionContextType> | null
  readonly integration_types?: ReadonlyArray<ApplicationIntegrationType> | null
  readonly handler?: null | ApplicationCommandHandler
}

export interface EmojiResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly user?: null | UserResponse
  readonly roles: ReadonlyArray<SnowflakeType>
  readonly require_colons: boolean
  readonly managed: boolean
  readonly animated: boolean
  readonly available: boolean
}

export interface ListApplicationEmojisResponse {
  readonly items: ReadonlyArray<EmojiResponse>
}

export interface CreateApplicationEmojiRequest {
  readonly name: string
  readonly image: string
}

export interface UpdateApplicationEmojiRequest {
  readonly name?: string
}

export interface GetEntitlementsParams {
  readonly user_id?: SnowflakeType
  readonly sku_ids: string | ReadonlyArray<null | SnowflakeType>
  readonly guild_id?: SnowflakeType
  readonly before?: SnowflakeType
  readonly after?: SnowflakeType
  readonly limit?: number
  readonly exclude_ended?: boolean
  readonly exclude_deleted?: boolean
  readonly only_active?: boolean
}

export const EntitlementTypes = {
  APPLICATION_SUBSCRIPTION: 8,
  QUEST_REWARD: 10,
} as const
export type EntitlementTypes =
  (typeof EntitlementTypes)[keyof typeof EntitlementTypes]

export const EntitlementTenantFulfillmentStatusResponse = {
  UNKNOWN: 0,
  FULFILLMENT_NOT_NEEDED: 1,
  FULFILLMENT_NEEDED: 2,
  FULFILLED: 3,
  FULFILLMENT_FAILED: 4,
  UNFULFILLMENT_NEEDED: 5,
  UNFULFILLED: 6,
  UNFULFILLMENT_FAILED: 7,
} as const
export type EntitlementTenantFulfillmentStatusResponse =
  (typeof EntitlementTenantFulfillmentStatusResponse)[keyof typeof EntitlementTenantFulfillmentStatusResponse]

export interface EntitlementResponse {
  readonly id: SnowflakeType
  readonly sku_id: SnowflakeType
  readonly application_id: SnowflakeType
  readonly user_id: SnowflakeType
  readonly guild_id?: null | SnowflakeType
  readonly deleted: boolean
  readonly starts_at?: string | null
  readonly ends_at?: string | null
  readonly type: EntitlementTypes
  readonly fulfilled_at?: string | null
  readonly fulfillment_status?: null | EntitlementTenantFulfillmentStatusResponse
  readonly consumed?: boolean | null
}

export type GetEntitlements200 = ReadonlyArray<null | EntitlementResponse>

export type EntitlementOwnerTypes = number

export interface CreateEntitlementRequestData {
  readonly sku_id: SnowflakeType
  readonly owner_id: SnowflakeType
  readonly owner_type: EntitlementOwnerTypes
}

export interface ListGuildApplicationCommandsParams {
  readonly with_localizations?: boolean
}

export type ListGuildApplicationCommands200 =
  ReadonlyArray<ApplicationCommandResponse>

export type BulkSetGuildApplicationCommandsRequest =
  ReadonlyArray<ApplicationCommandUpdateRequest>

export type BulkSetGuildApplicationCommands200 =
  ReadonlyArray<ApplicationCommandResponse>

export const ApplicationCommandPermissionType = {
  /** This permission is for a role. */
  ROLE: 1,
  /** This permission is for a user. */
  USER: 2,
  /** This permission is for a channel. */
  CHANNEL: 3,
} as const
export type ApplicationCommandPermissionType =
  (typeof ApplicationCommandPermissionType)[keyof typeof ApplicationCommandPermissionType]

export interface CommandPermissionResponse {
  readonly id: SnowflakeType
  readonly type: ApplicationCommandPermissionType
  readonly permission: boolean
}

export interface CommandPermissionsResponse {
  readonly id: SnowflakeType
  readonly application_id: SnowflakeType
  readonly guild_id: SnowflakeType
  readonly permissions: ReadonlyArray<CommandPermissionResponse>
}

export type ListGuildApplicationCommandPermissions200 =
  ReadonlyArray<CommandPermissionsResponse>

export interface ApplicationCommandPermission {
  readonly id: SnowflakeType
  readonly type: ApplicationCommandPermissionType
  readonly permission: boolean
}

export interface SetGuildApplicationCommandPermissionsRequest {
  readonly permissions?: ReadonlyArray<ApplicationCommandPermission> | null
}

export const MetadataItemTypes = {
  /** the metadata value (integer) is less than or equal to the guild's configured value (integer) */
  INTEGER_LESS_THAN_EQUAL: 1,
  /** the metadata value (integer) is greater than or equal to the guild's configured value (integer) */
  INTEGER_GREATER_THAN_EQUAL: 2,
  /** the metadata value (integer) is equal to the guild's configured value (integer) */
  INTEGER_EQUAL: 3,
  /** the metadata value (integer) is not equal to the guild's configured value (integer) */
  INTEGER_NOT_EQUAL: 4,
  /** the metadata value (ISO8601 string) is less than or equal to the guild's configured value (integer; days before current date) */
  DATETIME_LESS_THAN_EQUAL: 5,
  /** the metadata value (ISO8601 string) is greater than or equal to the guild's configured value (integer; days before current date) */
  DATETIME_GREATER_THAN_EQUAL: 6,
  /** the metadata value (integer) is equal to the guild's configured value (integer; 1) */
  BOOLEAN_EQUAL: 7,
  /** the metadata value (integer) is not equal to the guild's configured value (integer; 1) */
  BOOLEAN_NOT_EQUAL: 8,
} as const
export type MetadataItemTypes =
  (typeof MetadataItemTypes)[keyof typeof MetadataItemTypes]

export interface ApplicationRoleConnectionsMetadataItemResponse {
  readonly type: MetadataItemTypes
  readonly key: string
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localizations?: Record<string, unknown> | null
}

export type GetApplicationRoleConnectionsMetadata200 =
  ReadonlyArray<ApplicationRoleConnectionsMetadataItemResponse>

export interface ApplicationRoleConnectionsMetadataItemRequest {
  readonly type: MetadataItemTypes
  readonly key: string
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null
  readonly description: string
  readonly description_localizations?: Record<string, unknown> | null
}

export type UpdateApplicationRoleConnectionsMetadataRequest =
  ReadonlyArray<ApplicationRoleConnectionsMetadataItemRequest>

export type UpdateApplicationRoleConnectionsMetadata200 =
  ReadonlyArray<ApplicationRoleConnectionsMetadataItemResponse>

export const VideoQualityModes = {
  /** Discord chooses the quality for optimal performance */
  AUTO: 1,
  /** 720p */
  FULL: 2,
} as const
export type VideoQualityModes =
  (typeof VideoQualityModes)[keyof typeof VideoQualityModes]

export const ThreadAutoArchiveDuration = {
  /** One hour */
  ONE_HOUR: 60,
  /** One day */
  ONE_DAY: 1440,
  /** Three days */
  THREE_DAY: 4320,
  /** Seven days */
  SEVEN_DAY: 10080,
} as const
export type ThreadAutoArchiveDuration =
  (typeof ThreadAutoArchiveDuration)[keyof typeof ThreadAutoArchiveDuration]

export const ChannelPermissionOverwrites = {
  ROLE: 0,
  MEMBER: 1,
} as const
export type ChannelPermissionOverwrites =
  (typeof ChannelPermissionOverwrites)[keyof typeof ChannelPermissionOverwrites]

export interface ChannelPermissionOverwriteResponse {
  readonly id: SnowflakeType
  readonly type: ChannelPermissionOverwrites
  readonly allow: string
  readonly deny: string
}

export interface ForumTagResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly moderated: boolean
  readonly emoji_id?: null | SnowflakeType
  readonly emoji_name?: string | null
}

export interface DefaultReactionEmojiResponse {
  readonly emoji_id?: null | SnowflakeType
  readonly emoji_name?: string | null
}

export const ThreadSortOrder = {
  /** Sort forum posts by activity */
  LATEST_ACTIVITY: 0,
  /** Sort forum posts by creation time (from most recent to oldest) */
  CREATION_DATE: 1,
} as const
export type ThreadSortOrder =
  (typeof ThreadSortOrder)[keyof typeof ThreadSortOrder]

export const ForumLayout = {
  /** No default has been set for forum channel */
  DEFAULT: 0,
  /** Display posts as a list */
  LIST: 1,
  /** Display posts as a collection of tiles */
  GRID: 2,
} as const
export type ForumLayout = (typeof ForumLayout)[keyof typeof ForumLayout]

export type ThreadSearchTagSetting = string

export interface GuildChannelResponse {
  readonly id: SnowflakeType
  readonly type: 0 | 2 | 4 | 5 | 13 | 14 | 15
  readonly last_message_id?: null | SnowflakeType
  readonly flags: number
  readonly last_pin_timestamp?: string | null
  readonly guild_id: SnowflakeType
  readonly name: string
  readonly parent_id?: null | SnowflakeType
  readonly rate_limit_per_user?: number | null
  readonly bitrate?: number | null
  readonly user_limit?: number | null
  readonly rtc_region?: string | null
  readonly video_quality_mode?: null | VideoQualityModes
  readonly permissions?: string | null
  readonly topic?: string | null
  readonly default_auto_archive_duration?: null | ThreadAutoArchiveDuration
  readonly default_thread_rate_limit_per_user?: number | null
  readonly position: number
  readonly permission_overwrites?: ReadonlyArray<ChannelPermissionOverwriteResponse> | null
  readonly nsfw?: boolean | null
  readonly available_tags?: ReadonlyArray<ForumTagResponse> | null
  readonly default_reaction_emoji?: null | DefaultReactionEmojiResponse
  readonly default_sort_order?: null | ThreadSortOrder
  readonly default_forum_layout?: null | ForumLayout
  readonly default_tag_setting?: null | ThreadSearchTagSetting
  readonly hd_streaming_until?: string | null
  readonly hd_streaming_buyer_id?: null | SnowflakeType
}

export interface PrivateChannelResponse {
  readonly id: SnowflakeType
  readonly type: 1
  readonly last_message_id?: null | SnowflakeType
  readonly flags: number
  readonly last_pin_timestamp?: string | null
  readonly recipients: ReadonlyArray<UserResponse>
}

export interface PrivateGroupChannelResponse {
  readonly id: SnowflakeType
  readonly type: 3
  readonly last_message_id?: null | SnowflakeType
  readonly flags: number
  readonly last_pin_timestamp?: string | null
  readonly recipients: ReadonlyArray<UserResponse>
  readonly name?: string | null
  readonly icon?: string | null
  readonly owner_id?: null | SnowflakeType
  readonly managed?: boolean | null
  readonly application_id?: null | SnowflakeType
}

export interface ThreadMetadataResponse {
  readonly archived: boolean
  readonly archive_timestamp?: string | null
  readonly auto_archive_duration: ThreadAutoArchiveDuration
  readonly locked: boolean
  readonly create_timestamp?: string | null
  readonly invitable?: boolean | null
}

export interface GuildMemberResponse {
  readonly avatar?: string | null
  readonly avatar_decoration_data?: null | UserAvatarDecorationResponse
  readonly banner?: string | null
  readonly communication_disabled_until?: string | null
  readonly flags: number
  readonly joined_at: string
  readonly nick?: string | null
  readonly pending: boolean
  readonly premium_since?: string | null
  readonly roles: ReadonlyArray<SnowflakeType>
  readonly user: UserResponse
  readonly mute: boolean
  readonly deaf: boolean
}

export interface ThreadMemberResponse {
  readonly id: SnowflakeType
  readonly user_id: SnowflakeType
  readonly join_timestamp: string
  readonly flags: number
  readonly member?: null | GuildMemberResponse
}

export interface ThreadResponse {
  readonly id: SnowflakeType
  readonly type: 10 | 11 | 12
  readonly last_message_id?: null | SnowflakeType
  readonly flags: number
  readonly last_pin_timestamp?: string | null
  readonly guild_id: SnowflakeType
  readonly name: string
  readonly parent_id?: null | SnowflakeType
  readonly rate_limit_per_user?: number | null
  readonly bitrate?: number | null
  readonly user_limit?: number | null
  readonly rtc_region?: string | null
  readonly video_quality_mode?: null | VideoQualityModes
  readonly permissions?: string | null
  readonly owner_id: SnowflakeType
  readonly thread_metadata?: null | ThreadMetadataResponse
  readonly message_count: number
  readonly member_count: number
  readonly total_message_sent: number
  readonly applied_tags?: ReadonlyArray<SnowflakeType> | null
  readonly member?: null | ThreadMemberResponse
}

export type GetChannel200 =
  | GuildChannelResponse
  | PrivateChannelResponse
  | PrivateGroupChannelResponse
  | ThreadResponse

export type DeleteChannel200 =
  | GuildChannelResponse
  | PrivateChannelResponse
  | PrivateGroupChannelResponse
  | ThreadResponse

export interface UpdateDMRequestPartial {
  readonly name?: string | null
}

export interface UpdateGroupDMRequestPartial {
  readonly name?: string | null
  readonly icon?: string | null
}

export interface ChannelPermissionOverwriteRequest {
  readonly id: SnowflakeType
  readonly type?: null | ChannelPermissionOverwrites
  readonly allow?: number | null
  readonly deny?: number | null
}

export interface UpdateDefaultReactionEmojiRequest {
  readonly emoji_id?: null | SnowflakeType
  readonly emoji_name?: string | null
}

export interface UpdateThreadTagRequest {
  readonly name: string
  readonly emoji_id?: null | SnowflakeType
  readonly emoji_name?: string | null
  readonly moderated?: boolean | null
  readonly id?: null | SnowflakeType
}

export interface UpdateGuildChannelRequestPartial {
  readonly type?: null | 0 | 2 | 4 | 5 | 13 | 14 | 15
  readonly name?: string
  readonly position?: number | null
  readonly topic?: string | null
  readonly bitrate?: number | null
  readonly user_limit?: number | null
  readonly nsfw?: boolean | null
  readonly rate_limit_per_user?: number | null
  readonly parent_id?: null | SnowflakeType
  readonly permission_overwrites?: ReadonlyArray<ChannelPermissionOverwriteRequest> | null
  readonly rtc_region?: string | null
  readonly video_quality_mode?: null | VideoQualityModes
  readonly default_auto_archive_duration?: null | ThreadAutoArchiveDuration
  readonly default_reaction_emoji?: null | UpdateDefaultReactionEmojiRequest
  readonly default_thread_rate_limit_per_user?: number | null
  readonly default_sort_order?: null | ThreadSortOrder
  readonly default_forum_layout?: null | ForumLayout
  readonly default_tag_setting?: null | ThreadSearchTagSetting
  readonly flags?: number | null
  readonly available_tags?: ReadonlyArray<UpdateThreadTagRequest> | null
}

export interface UpdateThreadRequestPartial {
  readonly name?: string | null
  readonly archived?: boolean | null
  readonly locked?: boolean | null
  readonly invitable?: boolean | null
  readonly auto_archive_duration?: null | ThreadAutoArchiveDuration
  readonly rate_limit_per_user?: number | null
  readonly flags?: number | null
  readonly applied_tags?: ReadonlyArray<SnowflakeType> | null
  readonly bitrate?: number | null
  readonly user_limit?: number | null
  readonly rtc_region?: string | null
  readonly video_quality_mode?: null | VideoQualityModes
}

export type UpdateChannelRequest =
  | UpdateDMRequestPartial
  | UpdateGroupDMRequestPartial
  | UpdateGuildChannelRequestPartial
  | UpdateThreadRequestPartial

export type UpdateChannel200 =
  | GuildChannelResponse
  | PrivateChannelResponse
  | PrivateGroupChannelResponse
  | ThreadResponse

export interface FollowChannelRequest {
  readonly webhook_channel_id: SnowflakeType
}

export interface ChannelFollowerResponse {
  readonly channel_id: SnowflakeType
  readonly webhook_id: SnowflakeType
}

export const InviteTypes = {
  GUILD: 0,
  GROUP_DM: 1,
  FRIEND: 2,
} as const
export type InviteTypes = (typeof InviteTypes)[keyof typeof InviteTypes]

export interface InviteChannelRecipientResponse {
  readonly username: string
}

export interface InviteChannelResponse {
  readonly id: SnowflakeType
  readonly type: ChannelTypes
  readonly name?: string | null
  readonly icon?: string | null
  readonly recipients?: ReadonlyArray<InviteChannelRecipientResponse> | null
}

export interface FriendInviteResponse {
  readonly type?: null | 2
  readonly code: string
  readonly inviter?: null | UserResponse
  readonly max_age?: number | null
  readonly created_at?: string | null
  readonly expires_at?: string | null
  readonly friends_count?: number | null
  readonly channel?: null | InviteChannelResponse
  readonly is_contact?: boolean | null
  readonly uses?: number | null
  readonly max_uses?: number | null
  readonly flags?: number | null
}

export interface GroupDMInviteResponse {
  readonly type?: null | 1
  readonly code: string
  readonly inviter?: null | UserResponse
  readonly max_age?: number | null
  readonly created_at?: string | null
  readonly expires_at?: string | null
  readonly channel?: null | InviteChannelResponse
  readonly approximate_member_count?: number | null
}

export const GuildFeatures = {
  /** guild has access to set an animated guild banner image */
  ANIMATED_BANNER: "ANIMATED_BANNER",
  /** guild has access to set an animated guild icon */
  ANIMATED_ICON: "ANIMATED_ICON",
  /** guild is using the old permissions configuration behavior */
  APPLICATION_COMMAND_PERMISSIONS_V2: "APPLICATION_COMMAND_PERMISSIONS_V2",
  /** guild has set up auto moderation rules */
  AUTO_MODERATION: "AUTO_MODERATION",
  /** guild has access to set a guild banner image */
  BANNER: "BANNER",
  /** guild can enable welcome screen, Membership Screening, stage channels and discovery, and             receives community updates */
  COMMUNITY: "COMMUNITY",
  /** guild has enabled monetization */
  CREATOR_MONETIZABLE_PROVISIONAL: "CREATOR_MONETIZABLE_PROVISIONAL",
  /** guild has enabled the role subscription promo page */
  CREATOR_STORE_PAGE: "CREATOR_STORE_PAGE",
  /** guild has been set as a support server on the App Directory */
  DEVELOPER_SUPPORT_SERVER: "DEVELOPER_SUPPORT_SERVER",
  /** guild is able to be discovered in the directory */
  DISCOVERABLE: "DISCOVERABLE",
  /** guild is able to be featured in the directory */
  FEATURABLE: "FEATURABLE",
  /** guild has paused invites, preventing new users from joining */
  INVITES_DISABLED: "INVITES_DISABLED",
  /** guild has access to set an invite splash background */
  INVITE_SPLASH: "INVITE_SPLASH",
  /** guild has enabled Membership Screening */
  MEMBER_VERIFICATION_GATE_ENABLED: "MEMBER_VERIFICATION_GATE_ENABLED",
  /** guild has increased custom sticker slots */
  MORE_STICKERS: "MORE_STICKERS",
  /** guild has access to create announcement channels */
  NEWS: "NEWS",
  /** guild is partnered */
  PARTNERED: "PARTNERED",
  /** guild can be previewed before joining via Membership Screening or the directory */
  PREVIEW_ENABLED: "PREVIEW_ENABLED",
  /** guild has disabled activity alerts in the configured safety alerts channel */
  RAID_ALERTS_DISABLED: "RAID_ALERTS_DISABLED",
  /** guild is able to set role icons */
  ROLE_ICONS: "ROLE_ICONS",
  /** guild has role subscriptions that can be purchased */
  ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE:
    "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE",
  /** guild has enabled role subscriptions */
  ROLE_SUBSCRIPTIONS_ENABLED: "ROLE_SUBSCRIPTIONS_ENABLED",
  /** guild has enabled ticketed events */
  TICKETED_EVENTS_ENABLED: "TICKETED_EVENTS_ENABLED",
  /** guild has access to set a vanity URL */
  VANITY_URL: "VANITY_URL",
  /** guild is verified */
  VERIFIED: "VERIFIED",
  /** guild has access to set 384kbps bitrate in voice (previously VIP voice servers) */
  VIP_REGIONS: "VIP_REGIONS",
  /** guild has enabled the welcome screen */
  WELCOME_SCREEN_ENABLED: "WELCOME_SCREEN_ENABLED",
} as const
export type GuildFeatures = (typeof GuildFeatures)[keyof typeof GuildFeatures]

export const VerificationLevels = {
  /** unrestricted */
  NONE: 0,
  /** must have verified email on account */
  LOW: 1,
  /** must be registered on Discord for longer than 5 minutes */
  MEDIUM: 2,
  /** must be a member of the server for longer than 10 minutes */
  HIGH: 3,
  /** must have a verified phone number */
  VERY_HIGH: 4,
} as const
export type VerificationLevels =
  (typeof VerificationLevels)[keyof typeof VerificationLevels]

export const GuildNSFWContentLevel = {
  DEFAULT: 0,
  EXPLICIT: 1,
  SAFE: 2,
  AGE_RESTRICTED: 3,
} as const
export type GuildNSFWContentLevel =
  (typeof GuildNSFWContentLevel)[keyof typeof GuildNSFWContentLevel]

export interface InviteGuildResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly splash?: string | null
  readonly banner?: string | null
  readonly description?: string | null
  readonly icon?: string | null
  readonly features: ReadonlyArray<GuildFeatures>
  readonly verification_level?: null | VerificationLevels
  readonly vanity_url_code?: string | null
  readonly nsfw_level?: null | GuildNSFWContentLevel
  readonly nsfw?: boolean | null
  readonly premium_subscription_count?: number | null
}

export const InviteTargetTypes = {
  STREAM: 1,
  EMBEDDED_APPLICATION: 2,
  ROLE_SUBSCRIPTIONS_PURCHASE: 3,
} as const
export type InviteTargetTypes =
  (typeof InviteTargetTypes)[keyof typeof InviteTargetTypes]

export interface InviteApplicationResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly icon?: string | null
  readonly description: string
  readonly type?: null | ApplicationTypes
  readonly cover_image?: string | null
  readonly primary_sku_id?: null | SnowflakeType
  readonly bot?: null | UserResponse
  readonly slug?: string | null
  readonly guild_id?: null | SnowflakeType
  readonly rpc_origins?: ReadonlyArray<string> | null
  readonly bot_public?: boolean | null
  readonly bot_require_code_grant?: boolean | null
  readonly terms_of_service_url?: string | null
  readonly privacy_policy_url?: string | null
  readonly custom_install_url?: string | null
  readonly install_params?: null | ApplicationOAuth2InstallParamsResponse
  readonly integration_types_config?: Record<string, unknown> | null
  readonly verify_key: string
  readonly flags: number
  readonly max_participants?: number | null
  readonly tags?: ReadonlyArray<string> | null
}

export const GuildScheduledEventStatuses = {
  SCHEDULED: 1,
  ACTIVE: 2,
  COMPLETED: 3,
  CANCELED: 4,
} as const
export type GuildScheduledEventStatuses =
  (typeof GuildScheduledEventStatuses)[keyof typeof GuildScheduledEventStatuses]

export const GuildScheduledEventEntityTypes = {
  NONE: 0,
  STAGE_INSTANCE: 1,
  VOICE: 2,
  EXTERNAL: 3,
} as const
export type GuildScheduledEventEntityTypes =
  (typeof GuildScheduledEventEntityTypes)[keyof typeof GuildScheduledEventEntityTypes]

export type GuildScheduledEventPrivacyLevels = 2

export interface ScheduledEventUserResponse {
  readonly guild_scheduled_event_id: SnowflakeType
  readonly user_id: SnowflakeType
  readonly user?: null | UserResponse
  readonly member?: null | GuildMemberResponse
}

export interface ScheduledEventResponse {
  readonly id: SnowflakeType
  readonly guild_id: SnowflakeType
  readonly name: string
  readonly description?: string | null
  readonly channel_id?: null | SnowflakeType
  readonly creator_id?: null | SnowflakeType
  readonly creator?: null | UserResponse
  readonly image?: string | null
  readonly scheduled_start_time: string
  readonly scheduled_end_time?: string | null
  readonly status: GuildScheduledEventStatuses
  readonly entity_type: GuildScheduledEventEntityTypes
  readonly entity_id?: null | SnowflakeType
  readonly user_count?: number | null
  readonly privacy_level: GuildScheduledEventPrivacyLevels
  readonly user_rsvp?: null | ScheduledEventUserResponse
}

export interface GuildInviteResponse {
  readonly type?: null | 0
  readonly code: string
  readonly inviter?: null | UserResponse
  readonly max_age?: number | null
  readonly created_at?: string | null
  readonly expires_at?: string | null
  readonly is_contact?: boolean | null
  readonly flags?: number | null
  readonly guild?: null | InviteGuildResponse
  readonly guild_id?: null | SnowflakeType
  readonly channel?: null | InviteChannelResponse
  readonly target_type?: null | InviteTargetTypes
  readonly target_user?: null | UserResponse
  readonly target_application?: null | InviteApplicationResponse
  readonly guild_scheduled_event?: null | ScheduledEventResponse
  readonly uses?: number | null
  readonly max_uses?: number | null
  readonly temporary?: boolean | null
  readonly approximate_member_count?: number | null
  readonly approximate_presence_count?: number | null
  readonly is_nickname_changeable?: boolean | null
}

export type ListChannelInvites200 = ReadonlyArray<
  FriendInviteResponse | GroupDMInviteResponse | GuildInviteResponse
>

export interface CreateGroupDMInviteRequest {
  readonly max_age?: number | null
}

export interface CreateGuildInviteRequest {
  readonly max_age?: number | null
  readonly temporary?: boolean | null
  readonly max_uses?: number | null
  readonly unique?: boolean | null
  readonly target_user_id?: null | SnowflakeType
  readonly target_application_id?: null | SnowflakeType
  readonly target_type?: null | 1 | 2
}

export type CreateChannelInviteRequest =
  | CreateGroupDMInviteRequest
  | CreateGuildInviteRequest

export type CreateChannelInvite200 =
  | FriendInviteResponse
  | GroupDMInviteResponse
  | GuildInviteResponse

export interface ListMessagesParams {
  readonly around?: SnowflakeType
  readonly before?: SnowflakeType
  readonly after?: SnowflakeType
  readonly limit?: number
}

export const MessageType = {
  /**  */
  DEFAULT: 0,
  /**  */
  RECIPIENT_ADD: 1,
  /**  */
  RECIPIENT_REMOVE: 2,
  /**  */
  CALL: 3,
  /**  */
  CHANNEL_NAME_CHANGE: 4,
  /**  */
  CHANNEL_ICON_CHANGE: 5,
  /**  */
  CHANNEL_PINNED_MESSAGE: 6,
  /**  */
  USER_JOIN: 7,
  /**  */
  GUILD_BOOST: 8,
  /**  */
  GUILD_BOOST_TIER_1: 9,
  /**  */
  GUILD_BOOST_TIER_2: 10,
  /**  */
  GUILD_BOOST_TIER_3: 11,
  /**  */
  CHANNEL_FOLLOW_ADD: 12,
  /**  */
  GUILD_DISCOVERY_DISQUALIFIED: 14,
  /**  */
  GUILD_DISCOVERY_REQUALIFIED: 15,
  /**  */
  GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING: 16,
  /**  */
  GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING: 17,
  /**  */
  THREAD_CREATED: 18,
  /**  */
  REPLY: 19,
  /**  */
  CHAT_INPUT_COMMAND: 20,
  /**  */
  THREAD_STARTER_MESSAGE: 21,
  /**  */
  GUILD_INVITE_REMINDER: 22,
  /**  */
  CONTEXT_MENU_COMMAND: 23,
  /**  */
  AUTO_MODERATION_ACTION: 24,
  /**  */
  ROLE_SUBSCRIPTION_PURCHASE: 25,
  /**  */
  INTERACTION_PREMIUM_UPSELL: 26,
  /**  */
  STAGE_START: 27,
  /**  */
  STAGE_END: 28,
  /**  */
  STAGE_SPEAKER: 29,
  /**  */
  STAGE_TOPIC: 31,
  /**  */
  GUILD_APPLICATION_PREMIUM_SUBSCRIPTION: 32,
  /**  */
  GUILD_INCIDENT_ALERT_MODE_ENABLED: 36,
  /**  */
  GUILD_INCIDENT_ALERT_MODE_DISABLED: 37,
  /**  */
  GUILD_INCIDENT_REPORT_RAID: 38,
  /**  */
  GUILD_INCIDENT_REPORT_FALSE_ALARM: 39,
  /**  */
  POLL_RESULT: 46,
  /**  */
  HD_STREAMING_UPGRADED: 55,
} as const
export type MessageType = (typeof MessageType)[keyof typeof MessageType]

export interface MessageAttachmentResponse {
  readonly id: SnowflakeType
  readonly filename: string
  readonly size: number
  readonly url: string
  readonly proxy_url: string
  readonly width?: number | null
  readonly height?: number | null
  readonly duration_secs?: number | null
  readonly waveform?: string | null
  readonly description?: string | null
  readonly content_type?: string | null
  readonly ephemeral?: boolean | null
  readonly title?: string | null
  readonly application?: null | ApplicationResponse
  readonly clip_created_at?: string | null
  readonly clip_participants?: ReadonlyArray<UserResponse> | null
}

export interface MessageEmbedFieldResponse {
  readonly name: string
  readonly value: string
  readonly inline: boolean
}

export interface MessageEmbedAuthorResponse {
  readonly name: string
  readonly url?: string | null
  readonly icon_url?: string | null
  readonly proxy_icon_url?: string | null
}

export interface MessageEmbedProviderResponse {
  readonly name: string
  readonly url?: string | null
}

export type UInt32Type = number

export interface MessageEmbedImageResponse {
  readonly url?: string | null
  readonly proxy_url?: string | null
  readonly width?: null | UInt32Type
  readonly height?: null | UInt32Type
  readonly placeholder?: string | null
  readonly placeholder_version?: null | UInt32Type
  readonly description?: string | null
  readonly flags?: null | UInt32Type
}

export interface MessageEmbedVideoResponse {
  readonly url?: string | null
  readonly proxy_url?: string | null
  readonly width?: null | UInt32Type
  readonly height?: null | UInt32Type
  readonly placeholder?: string | null
  readonly placeholder_version?: null | UInt32Type
  readonly description?: string | null
  readonly flags?: null | UInt32Type
}

export interface MessageEmbedFooterResponse {
  readonly text: string
  readonly icon_url?: string | null
  readonly proxy_icon_url?: string | null
}

export interface MessageEmbedResponse {
  readonly type: string
  readonly url?: string | null
  readonly title?: string | null
  readonly description?: string | null
  readonly color?: number | null
  readonly timestamp?: string | null
  readonly fields?: ReadonlyArray<MessageEmbedFieldResponse> | null
  readonly author?: null | MessageEmbedAuthorResponse
  readonly provider?: null | MessageEmbedProviderResponse
  readonly image?: null | MessageEmbedImageResponse
  readonly thumbnail?: null | MessageEmbedImageResponse
  readonly video?: null | MessageEmbedVideoResponse
  readonly footer?: null | MessageEmbedFooterResponse
}

export const MessageComponentTypes = {
  /** Container for other components */
  ACTION_ROW: 1,
  /** Button object */
  BUTTON: 2,
  /** Select menu for picking from defined text options */
  STRING_SELECT: 3,
  /** Text input object */
  TEXT_INPUT: 4,
  /** Select menu for users */
  USER_SELECT: 5,
  /** Select menu for roles */
  ROLE_SELECT: 6,
  /** Select menu for mentionables (users and roles) */
  MENTIONABLE_SELECT: 7,
  /** Select menu for channels */
  CHANNEL_SELECT: 8,
  /** Section component */
  SECTION: 9,
  /** Text component */
  TEXT_DISPLAY: 10,
  /** Thumbnail component */
  THUMBNAIL: 11,
  /** Media gallery component */
  MEDIA_GALLERY: 12,
  /** File component */
  FILE: 13,
  /** Separator component */
  SEPARATOR: 14,
  /** Container component */
  CONTAINER: 17,
} as const
export type MessageComponentTypes =
  (typeof MessageComponentTypes)[keyof typeof MessageComponentTypes]

export const ButtonStyleTypes = {
  PRIMARY: 1,
  SECONDARY: 2,
  SUCCESS: 3,
  DANGER: 4,
  LINK: 5,
  PREMIUM: 6,
} as const
export type ButtonStyleTypes =
  (typeof ButtonStyleTypes)[keyof typeof ButtonStyleTypes]

export interface ComponentEmojiResponse {
  readonly id?: null | SnowflakeType
  readonly name: string
  readonly animated?: boolean | null
}

export interface ButtonComponentResponse {
  readonly type: 2
  readonly id: number
  readonly custom_id?: string | null
  readonly style: ButtonStyleTypes
  readonly label?: string | null
  readonly disabled?: boolean | null
  readonly emoji?: null | ComponentEmojiResponse
  readonly url?: string | null
  readonly sku_id?: null | SnowflakeType
}

export const SnowflakeSelectDefaultValueTypes = {
  USER: "user",
  ROLE: "role",
  CHANNEL: "channel",
} as const
export type SnowflakeSelectDefaultValueTypes =
  (typeof SnowflakeSelectDefaultValueTypes)[keyof typeof SnowflakeSelectDefaultValueTypes]

export interface ChannelSelectDefaultValueResponse {
  readonly type: "channel"
  readonly id: SnowflakeType
}

export interface ChannelSelectComponentResponse {
  readonly type: 8
  readonly id: number
  readonly custom_id: string
  readonly placeholder?: string | null
  readonly min_values?: number | null
  readonly max_values?: number | null
  readonly disabled?: boolean | null
  readonly channel_types?: ReadonlyArray<ChannelTypes> | null
  readonly default_values?: ReadonlyArray<ChannelSelectDefaultValueResponse> | null
}

export interface RoleSelectDefaultValueResponse {
  readonly type: "role"
  readonly id: SnowflakeType
}

export interface UserSelectDefaultValueResponse {
  readonly type: "user"
  readonly id: SnowflakeType
}

export interface MentionableSelectComponentResponse {
  readonly type: 7
  readonly id: number
  readonly custom_id: string
  readonly placeholder?: string | null
  readonly min_values?: number | null
  readonly max_values?: number | null
  readonly disabled?: boolean | null
  readonly default_values?: ReadonlyArray<
    RoleSelectDefaultValueResponse | UserSelectDefaultValueResponse
  > | null
}

export interface RoleSelectComponentResponse {
  readonly type: 6
  readonly id: number
  readonly custom_id: string
  readonly placeholder?: string | null
  readonly min_values?: number | null
  readonly max_values?: number | null
  readonly disabled?: boolean | null
  readonly default_values?: ReadonlyArray<RoleSelectDefaultValueResponse> | null
}

export interface StringSelectOptionResponse {
  readonly label: string
  readonly value: string
  readonly description?: string | null
  readonly emoji?: null | ComponentEmojiResponse
  readonly default?: boolean | null
}

export interface StringSelectComponentResponse {
  readonly type: 3
  readonly id: number
  readonly custom_id: string
  readonly placeholder?: string | null
  readonly min_values?: number | null
  readonly max_values?: number | null
  readonly disabled?: boolean | null
  readonly options: ReadonlyArray<StringSelectOptionResponse>
}

export const TextInputStyleTypes = {
  /** Single-line input */
  SHORT: 1,
  /** Multi-line input */
  PARAGRAPH: 2,
} as const
export type TextInputStyleTypes =
  (typeof TextInputStyleTypes)[keyof typeof TextInputStyleTypes]

export interface TextInputComponentResponse {
  readonly type: 4
  readonly id: number
  readonly custom_id: string
  readonly style: TextInputStyleTypes
  readonly label?: string | null
  readonly value?: string | null
  readonly placeholder?: string | null
  readonly required?: boolean | null
  readonly min_length?: number | null
  readonly max_length?: number | null
}

export interface UserSelectComponentResponse {
  readonly type: 5
  readonly id: number
  readonly custom_id: string
  readonly placeholder?: string | null
  readonly min_values?: number | null
  readonly max_values?: number | null
  readonly disabled?: boolean | null
  readonly default_values?: ReadonlyArray<UserSelectDefaultValueResponse> | null
}

export interface ActionRowComponentResponse {
  readonly type: 1
  readonly id: number
  readonly components?: ReadonlyArray<
    | ButtonComponentResponse
    | ChannelSelectComponentResponse
    | MentionableSelectComponentResponse
    | RoleSelectComponentResponse
    | StringSelectComponentResponse
    | TextInputComponentResponse
    | UserSelectComponentResponse
  > | null
}

export interface UnfurledMediaResponse {
  readonly id: SnowflakeType
  readonly url: string
  readonly proxy_url: string
  readonly width?: number | null
  readonly height?: number | null
  readonly content_type?: string | null
}

export interface FileComponentResponse {
  readonly type: 13
  readonly id: number
  readonly file: UnfurledMediaResponse
  readonly name?: string | null
  readonly size?: number | null
  readonly spoiler: boolean
}

export interface MediaGalleryItemResponse {
  readonly media: UnfurledMediaResponse
  readonly description?: string | null
  readonly spoiler: boolean
}

export interface MediaGalleryComponentResponse {
  readonly type: 12
  readonly id: number
  readonly items: ReadonlyArray<MediaGalleryItemResponse>
}

export interface TextDisplayComponentResponse {
  readonly type: 10
  readonly id: number
  readonly content: string
}

export interface ThumbnailComponentResponse {
  readonly type: 11
  readonly id: number
  readonly media: UnfurledMediaResponse
  readonly description?: string | null
  readonly spoiler: boolean
}

export interface SectionComponentResponse {
  readonly type: 9
  readonly id: number
  readonly components: ReadonlyArray<TextDisplayComponentResponse>
  readonly accessory: ButtonComponentResponse | ThumbnailComponentResponse
}

export const MessageComponentSeparatorSpacingSize = {
  /** Small spacing */
  SMALL: 1,
  /** Large spacing */
  LARGE: 2,
} as const
export type MessageComponentSeparatorSpacingSize =
  (typeof MessageComponentSeparatorSpacingSize)[keyof typeof MessageComponentSeparatorSpacingSize]

export interface SeparatorComponentResponse {
  readonly type: 14
  readonly id: number
  readonly spacing: MessageComponentSeparatorSpacingSize
  readonly divider: boolean
}

export interface ContainerComponentResponse {
  readonly type: 17
  readonly id: number
  readonly accent_color?: number | null
  readonly components: ReadonlyArray<
    | ActionRowComponentResponse
    | FileComponentResponse
    | MediaGalleryComponentResponse
    | SectionComponentResponse
    | SeparatorComponentResponse
    | TextDisplayComponentResponse
  >
  readonly spoiler: boolean
}

export interface ResolvedObjectsResponse {
  readonly users: Record<string, unknown>
  readonly members: Record<string, unknown>
  readonly channels: Record<string, unknown>
  readonly roles: Record<string, unknown>
}

export const StickerTypes = {
  /** an official sticker in a pack, part of Nitro or in a removed purchasable pack */
  STANDARD: 1,
  /** a sticker uploaded to a guild for the guild's members */
  GUILD: 2,
} as const
export type StickerTypes = (typeof StickerTypes)[keyof typeof StickerTypes]

export const StickerFormatTypes = {
  PNG: 1,
  APNG: 2,
  LOTTIE: 3,
  GIF: 4,
} as const
export type StickerFormatTypes =
  (typeof StickerFormatTypes)[keyof typeof StickerFormatTypes]

export interface GuildStickerResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly tags: string
  readonly type: 2
  readonly format_type?: null | StickerFormatTypes
  readonly description?: string | null
  readonly available: boolean
  readonly guild_id: SnowflakeType
  readonly user?: null | UserResponse
}

export interface StandardStickerResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly tags: string
  readonly type: 1
  readonly format_type?: null | StickerFormatTypes
  readonly description?: string | null
  readonly pack_id: SnowflakeType
  readonly sort_value: number
}

export interface MessageStickerItemResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly format_type: StickerFormatTypes
}

export interface MessageCallResponse {
  readonly ended_timestamp?: string | null
  readonly participants: ReadonlyArray<SnowflakeType>
}

export interface MessageActivityResponse {}

export interface BasicApplicationResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly icon?: string | null
  readonly description: string
  readonly type?: null | ApplicationTypes
  readonly cover_image?: string | null
  readonly primary_sku_id?: null | SnowflakeType
  readonly bot?: null | UserResponse
}

export const InteractionTypes = {
  /** Sent by Discord to validate your application's interaction handler */
  PING: 1,
  /** Sent when a user uses an application command */
  APPLICATION_COMMAND: 2,
  /** Sent when a user interacts with a message component previously sent by your application */
  MESSAGE_COMPONENT: 3,
  /** Sent when a user is filling in an autocomplete option in a chat command */
  APPLICATION_COMMAND_AUTOCOMPLETE: 4,
  /** Sent when a user submits a modal previously sent by your application */
  MODAL_SUBMIT: 5,
} as const
export type InteractionTypes =
  (typeof InteractionTypes)[keyof typeof InteractionTypes]

export interface MessageInteractionResponse {
  readonly id: SnowflakeType
  readonly type: InteractionTypes
  readonly name: string
  readonly user?: null | UserResponse
  readonly name_localized?: string | null
}

export type MessageReferenceType = 0

export interface MessageReferenceResponse {
  readonly type?: null | MessageReferenceType
  readonly channel_id: SnowflakeType
  readonly message_id?: null | SnowflakeType
  readonly guild_id?: null | SnowflakeType
}

export interface MessageMentionChannelResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly type: ChannelTypes
  readonly guild_id: SnowflakeType
}

export interface MessageRoleSubscriptionDataResponse {
  readonly role_subscription_listing_id: SnowflakeType
  readonly tier_name: string
  readonly total_months_subscribed: number
  readonly is_renewal: boolean
}

export type PurchaseType = 0

export interface GuildProductPurchaseResponse {
  readonly listing_id: SnowflakeType
  readonly product_name: string
}

export interface PurchaseNotificationResponse {
  readonly type: PurchaseType
  readonly guild_product_purchase?: null | GuildProductPurchaseResponse
}

export interface MessageReactionEmojiResponse {
  readonly id?: null | SnowflakeType
  readonly name?: string | null
  readonly animated?: boolean | null
}

export interface PollMediaResponse {
  readonly text?: string | null
  readonly emoji?: null | MessageReactionEmojiResponse
}

export interface PollAnswerResponse {
  readonly answer_id: number
  readonly poll_media: PollMediaResponse
}

export type PollLayoutTypes = number

export interface PollResultsEntryResponse {
  readonly id: number
  readonly count: number
  readonly me_voted?: boolean | null
}

export interface PollResultsResponse {
  readonly answer_counts?: ReadonlyArray<PollResultsEntryResponse> | null
  readonly is_finalized: boolean
}

export interface PollResponse {
  readonly question: PollMediaResponse
  readonly answers: ReadonlyArray<PollAnswerResponse>
  readonly expiry: string
  readonly allow_multiselect: boolean
  readonly layout_type: PollLayoutTypes
  readonly results: PollResultsResponse
}

export interface ApplicationCommandInteractionMetadataResponse {
  readonly id: SnowflakeType
  readonly type: 2
  readonly user?: null | UserResponse
  readonly authorizing_integration_owners: Record<string, unknown>
  readonly original_response_message_id?: null | SnowflakeType
  readonly target_user?: null | UserResponse
  readonly target_message_id?: null | SnowflakeType
}

export interface MessageComponentInteractionMetadataResponse {
  readonly id: SnowflakeType
  readonly type: 3
  readonly user?: null | UserResponse
  readonly authorizing_integration_owners: Record<string, unknown>
  readonly original_response_message_id?: null | SnowflakeType
  readonly interacted_message_id: SnowflakeType
}

export interface ModalSubmitInteractionMetadataResponse {
  readonly id: SnowflakeType
  readonly type: 5
  readonly user?: null | UserResponse
  readonly authorizing_integration_owners: Record<string, unknown>
  readonly original_response_message_id?: null | SnowflakeType
  readonly triggering_interaction_metadata:
    | ApplicationCommandInteractionMetadataResponse
    | MessageComponentInteractionMetadataResponse
}

export interface MinimalContentMessageResponse {
  readonly type: MessageType
  readonly content: string
  readonly mentions: ReadonlyArray<UserResponse>
  readonly mention_roles: ReadonlyArray<SnowflakeType>
  readonly attachments: ReadonlyArray<MessageAttachmentResponse>
  readonly embeds: ReadonlyArray<MessageEmbedResponse>
  readonly timestamp: string
  readonly edited_timestamp?: string | null
  readonly flags: number
  readonly components: ReadonlyArray<
    | ActionRowComponentResponse
    | ContainerComponentResponse
    | FileComponentResponse
    | MediaGalleryComponentResponse
    | SectionComponentResponse
    | SeparatorComponentResponse
    | TextDisplayComponentResponse
  >
  readonly resolved?: null | ResolvedObjectsResponse
  readonly stickers?: ReadonlyArray<
    GuildStickerResponse | StandardStickerResponse
  > | null
  readonly sticker_items?: ReadonlyArray<MessageStickerItemResponse> | null
}

export interface MessageSnapshotResponse {
  readonly message?: null | MinimalContentMessageResponse
}

export interface MessageReactionCountDetailsResponse {
  readonly burst: number
  readonly normal: number
}

export interface MessageReactionResponse {
  readonly emoji: MessageReactionEmojiResponse
  readonly count: number
  readonly count_details: MessageReactionCountDetailsResponse
  readonly burst_colors: ReadonlyArray<string>
  readonly me_burst: boolean
  readonly me: boolean
}

export interface BasicMessageResponse {
  readonly type: MessageType
  readonly content: string
  readonly mentions: ReadonlyArray<UserResponse>
  readonly mention_roles: ReadonlyArray<SnowflakeType>
  readonly attachments: ReadonlyArray<MessageAttachmentResponse>
  readonly embeds: ReadonlyArray<MessageEmbedResponse>
  readonly timestamp: string
  readonly edited_timestamp?: string | null
  readonly flags: number
  readonly components: ReadonlyArray<
    | ActionRowComponentResponse
    | ContainerComponentResponse
    | FileComponentResponse
    | MediaGalleryComponentResponse
    | SectionComponentResponse
    | SeparatorComponentResponse
    | TextDisplayComponentResponse
  >
  readonly resolved?: null | ResolvedObjectsResponse
  readonly stickers?: ReadonlyArray<
    GuildStickerResponse | StandardStickerResponse
  > | null
  readonly sticker_items?: ReadonlyArray<MessageStickerItemResponse> | null
  readonly id: SnowflakeType
  readonly channel_id: SnowflakeType
  readonly author: UserResponse
  readonly pinned: boolean
  readonly mention_everyone: boolean
  readonly tts: boolean
  readonly call?: null | MessageCallResponse
  readonly activity?: null | MessageActivityResponse
  readonly application?: null | BasicApplicationResponse
  readonly application_id?: null | SnowflakeType
  readonly interaction?: null | MessageInteractionResponse
  readonly nonce?: number | string | null
  readonly webhook_id?: null | SnowflakeType
  readonly message_reference?: null | MessageReferenceResponse
  readonly thread?: null | ThreadResponse
  readonly mention_channels?: ReadonlyArray<null | MessageMentionChannelResponse> | null
  readonly role_subscription_data?: null | MessageRoleSubscriptionDataResponse
  readonly purchase_notification?: null | PurchaseNotificationResponse
  readonly position?: number | null
  readonly poll?: null | PollResponse
  readonly interaction_metadata?:
    | ApplicationCommandInteractionMetadataResponse
    | MessageComponentInteractionMetadataResponse
    | ModalSubmitInteractionMetadataResponse
    | null
  readonly message_snapshots?: ReadonlyArray<MessageSnapshotResponse> | null
}

export interface MessageResponse {
  readonly type: MessageType
  readonly content: string
  readonly mentions: ReadonlyArray<UserResponse>
  readonly mention_roles: ReadonlyArray<SnowflakeType>
  readonly attachments: ReadonlyArray<MessageAttachmentResponse>
  readonly embeds: ReadonlyArray<MessageEmbedResponse>
  readonly timestamp: string
  readonly edited_timestamp?: string | null
  readonly flags: number
  readonly components: ReadonlyArray<
    | ActionRowComponentResponse
    | ContainerComponentResponse
    | FileComponentResponse
    | MediaGalleryComponentResponse
    | SectionComponentResponse
    | SeparatorComponentResponse
    | TextDisplayComponentResponse
  >
  readonly resolved?: null | ResolvedObjectsResponse
  readonly stickers?: ReadonlyArray<
    GuildStickerResponse | StandardStickerResponse
  > | null
  readonly sticker_items?: ReadonlyArray<MessageStickerItemResponse> | null
  readonly id: SnowflakeType
  readonly channel_id: SnowflakeType
  readonly author: UserResponse
  readonly pinned: boolean
  readonly mention_everyone: boolean
  readonly tts: boolean
  readonly call?: null | MessageCallResponse
  readonly activity?: null | MessageActivityResponse
  readonly application?: null | BasicApplicationResponse
  readonly application_id?: null | SnowflakeType
  readonly interaction?: null | MessageInteractionResponse
  readonly nonce?: number | string | null
  readonly webhook_id?: null | SnowflakeType
  readonly message_reference?: null | MessageReferenceResponse
  readonly thread?: null | ThreadResponse
  readonly mention_channels?: ReadonlyArray<null | MessageMentionChannelResponse> | null
  readonly role_subscription_data?: null | MessageRoleSubscriptionDataResponse
  readonly purchase_notification?: null | PurchaseNotificationResponse
  readonly position?: number | null
  readonly poll?: null | PollResponse
  readonly interaction_metadata?:
    | ApplicationCommandInteractionMetadataResponse
    | MessageComponentInteractionMetadataResponse
    | ModalSubmitInteractionMetadataResponse
    | null
  readonly message_snapshots?: ReadonlyArray<MessageSnapshotResponse> | null
  readonly reactions?: ReadonlyArray<MessageReactionResponse> | null
  readonly referenced_message?: null | BasicMessageResponse
}

export type ListMessages200 = ReadonlyArray<MessageResponse>

export interface RichEmbedAuthor {
  readonly name?: string | null
  readonly url?: string | null
  readonly icon_url?: string | null
}

export interface RichEmbedImage {
  readonly url?: string | null
  readonly width?: number | null
  readonly height?: number | null
  readonly placeholder?: string | null
  readonly placeholder_version?: number | null
  readonly is_animated?: boolean | null
  readonly description?: string | null
}

export interface RichEmbedThumbnail {
  readonly url?: string | null
  readonly width?: number | null
  readonly height?: number | null
  readonly placeholder?: string | null
  readonly placeholder_version?: number | null
  readonly is_animated?: boolean | null
  readonly description?: string | null
}

export interface RichEmbedFooter {
  readonly text?: string | null
  readonly icon_url?: string | null
}

export interface RichEmbedField {
  readonly name: string
  readonly value: string
  readonly inline?: boolean | null
}

export interface RichEmbedProvider {
  readonly name?: string | null
  readonly url?: string | null
}

export interface RichEmbedVideo {
  readonly url?: string | null
  readonly width?: number | null
  readonly height?: number | null
  readonly placeholder?: string | null
  readonly placeholder_version?: number | null
  readonly is_animated?: boolean | null
  readonly description?: string | null
}

export interface RichEmbed {
  readonly type?: string | null
  readonly url?: string | null
  readonly title?: string | null
  readonly color?: number | null
  readonly timestamp?: string | null
  readonly description?: string | null
  readonly author?: null | RichEmbedAuthor
  readonly image?: null | RichEmbedImage
  readonly thumbnail?: null | RichEmbedThumbnail
  readonly footer?: null | RichEmbedFooter
  readonly fields?: ReadonlyArray<RichEmbedField> | null
  readonly provider?: null | RichEmbedProvider
  readonly video?: null | RichEmbedVideo
}

export const AllowedMentionTypes = {
  /** Controls role mentions */
  USERS: "users",
  /** Controls user mentions */
  ROLES: "roles",
  /** Controls @everyone and @here mentions */
  EVERYONE: "everyone",
} as const
export type AllowedMentionTypes =
  (typeof AllowedMentionTypes)[keyof typeof AllowedMentionTypes]

export interface MessageAllowedMentionsRequest {
  readonly parse?: ReadonlyArray<null | AllowedMentionTypes> | null
  readonly users?: ReadonlyArray<null | SnowflakeType> | null
  readonly roles?: ReadonlyArray<null | SnowflakeType> | null
  readonly replied_user?: boolean | null
}

export interface ComponentEmojiForMessageRequest {
  readonly id?: null | SnowflakeType
  readonly name: string
}

export interface ButtonComponentForMessageRequest {
  readonly type: 2
  readonly custom_id?: string | null
  readonly style: ButtonStyleTypes
  readonly label?: string | null
  readonly disabled?: boolean | null
  readonly url?: string | null
  readonly sku_id?: null | SnowflakeType
  readonly emoji?: null | ComponentEmojiForMessageRequest
}

export interface ChannelSelectDefaultValue {
  readonly type: "channel"
  readonly id: SnowflakeType
}

export interface ChannelSelectComponentForMessageRequest {
  readonly type: 8
  readonly custom_id: string
  readonly placeholder?: string | null
  readonly min_values?: number | null
  readonly max_values?: number | null
  readonly disabled?: boolean | null
  readonly default_values?: ReadonlyArray<ChannelSelectDefaultValue> | null
  readonly channel_types?: ReadonlyArray<ChannelTypes> | null
}

export interface RoleSelectDefaultValue {
  readonly type: "role"
  readonly id: SnowflakeType
}

export interface UserSelectDefaultValue {
  readonly type: "user"
  readonly id: SnowflakeType
}

export interface MentionableSelectComponentForMessageRequest {
  readonly type: 7
  readonly custom_id: string
  readonly placeholder?: string | null
  readonly min_values?: number | null
  readonly max_values?: number | null
  readonly disabled?: boolean | null
  readonly default_values?: ReadonlyArray<
    RoleSelectDefaultValue | UserSelectDefaultValue
  > | null
}

export interface RoleSelectComponentForMessageRequest {
  readonly type: 6
  readonly custom_id: string
  readonly placeholder?: string | null
  readonly min_values?: number | null
  readonly max_values?: number | null
  readonly disabled?: boolean | null
  readonly default_values?: ReadonlyArray<RoleSelectDefaultValue> | null
}

export interface StringSelectOptionForMessageRequest {
  readonly label: string
  readonly value: string
  readonly description?: string | null
  readonly default?: boolean | null
  readonly emoji?: null | ComponentEmojiForMessageRequest
}

export interface StringSelectComponentForMessageRequest {
  readonly type: 3
  readonly custom_id: string
  readonly placeholder?: string | null
  readonly min_values?: number | null
  readonly max_values?: number | null
  readonly disabled?: boolean | null
  readonly options: ReadonlyArray<StringSelectOptionForMessageRequest>
}

export interface UserSelectComponentForMessageRequest {
  readonly type: 5
  readonly custom_id: string
  readonly placeholder?: string | null
  readonly min_values?: number | null
  readonly max_values?: number | null
  readonly disabled?: boolean | null
  readonly default_values?: ReadonlyArray<UserSelectDefaultValue> | null
}

export interface ActionRowComponentForMessageRequest {
  readonly type: 1
  readonly components: ReadonlyArray<
    | ButtonComponentForMessageRequest
    | ChannelSelectComponentForMessageRequest
    | MentionableSelectComponentForMessageRequest
    | RoleSelectComponentForMessageRequest
    | StringSelectComponentForMessageRequest
    | UserSelectComponentForMessageRequest
  >
}

export interface UnfurledMediaRequestWithAttachmentReferenceRequired {
  readonly url: string
}

export interface FileComponentForMessageRequest {
  readonly type: 13
  readonly spoiler?: boolean | null
  readonly file: UnfurledMediaRequestWithAttachmentReferenceRequired
}

export interface UnfurledMediaRequest {
  readonly url: string
}

export interface MediaGalleryItemRequest {
  readonly description?: string | null
  readonly spoiler?: boolean | null
  readonly media: UnfurledMediaRequest
}

export interface MediaGalleryComponentForMessageRequest {
  readonly type: 12
  readonly items: ReadonlyArray<MediaGalleryItemRequest>
}

export interface TextDisplayComponentForMessageRequest {
  readonly type: 10
  readonly content: string
}

export interface ThumbnailComponentForMessageRequest {
  readonly type: 11
  readonly description?: string | null
  readonly spoiler?: boolean | null
  readonly media: UnfurledMediaRequest
}

export interface SectionComponentForMessageRequest {
  readonly type: 9
  readonly components: ReadonlyArray<TextDisplayComponentForMessageRequest>
  readonly accessory:
    | ButtonComponentForMessageRequest
    | ThumbnailComponentForMessageRequest
}

export interface SeparatorComponentForMessageRequest {
  readonly type: 14
  readonly spacing?: null | MessageComponentSeparatorSpacingSize
  readonly divider?: boolean | null
}

export interface ContainerComponentForMessageRequest {
  readonly type: 17
  readonly accent_color?: number | null
  readonly components: ReadonlyArray<
    | ActionRowComponentForMessageRequest
    | FileComponentForMessageRequest
    | MediaGalleryComponentForMessageRequest
    | SectionComponentForMessageRequest
    | SeparatorComponentForMessageRequest
    | TextDisplayComponentForMessageRequest
  >
  readonly spoiler?: boolean | null
}

export interface MessageAttachmentRequest {
  readonly id: SnowflakeType
  readonly filename?: string | null
  readonly description?: string | null
  readonly duration_secs?: number | null
  readonly waveform?: string | null
  readonly title?: string | null
  readonly is_remix?: boolean | null
}

export interface PollEmoji {
  readonly id?: null | SnowflakeType
  readonly name?: string | null
  readonly animated?: boolean | null
}

export interface PollMedia {
  readonly text?: string | null
  readonly emoji?: null | PollEmoji
}

export interface PollEmojiCreateRequest {
  readonly id?: null | SnowflakeType
  readonly name?: string | null
  readonly animated?: boolean | null
}

export interface PollMediaCreateRequest {
  readonly text?: string | null
  readonly emoji?: null | PollEmojiCreateRequest
}

export interface PollAnswerCreateRequest {
  readonly poll_media: PollMediaCreateRequest
}

export interface PollCreateRequest {
  readonly question: PollMedia
  readonly answers: ReadonlyArray<PollAnswerCreateRequest>
  readonly allow_multiselect?: boolean | null
  readonly layout_type?: null | PollLayoutTypes
  readonly duration?: number | null
}

export interface ConfettiPotionCreateRequest {}

export interface MessageReferenceRequest {
  readonly guild_id?: null | SnowflakeType
  readonly channel_id?: null | SnowflakeType
  readonly message_id: SnowflakeType
  readonly fail_if_not_exists?: boolean | null
  readonly type?: null | MessageReferenceType
}

export interface MessageCreateRequest {
  readonly content?: string | null
  readonly embeds?: ReadonlyArray<RichEmbed> | null
  readonly allowed_mentions?: null | MessageAllowedMentionsRequest
  readonly sticker_ids?: ReadonlyArray<SnowflakeType> | null
  readonly components?: ReadonlyArray<
    | ActionRowComponentForMessageRequest
    | ContainerComponentForMessageRequest
    | FileComponentForMessageRequest
    | MediaGalleryComponentForMessageRequest
    | SectionComponentForMessageRequest
    | SeparatorComponentForMessageRequest
    | TextDisplayComponentForMessageRequest
  > | null
  readonly flags?: number | null
  readonly attachments?: ReadonlyArray<MessageAttachmentRequest> | null
  readonly poll?: null | PollCreateRequest
  readonly confetti_potion?: null | ConfettiPotionCreateRequest
  readonly message_reference?: null | MessageReferenceRequest
  readonly nonce?: number | string | null
  readonly enforce_nonce?: boolean | null
  readonly tts?: boolean | null
}

export interface BulkDeleteMessagesRequest {
  readonly messages: ReadonlyArray<SnowflakeType>
}

export interface MessageEditRequestPartial {
  readonly content?: string | null
  readonly embeds?: ReadonlyArray<RichEmbed> | null
  readonly flags?: number | null
  readonly allowed_mentions?: null | MessageAllowedMentionsRequest
  readonly sticker_ids?: ReadonlyArray<SnowflakeType> | null
  readonly components?: ReadonlyArray<
    | ActionRowComponentForMessageRequest
    | ContainerComponentForMessageRequest
    | FileComponentForMessageRequest
    | MediaGalleryComponentForMessageRequest
    | SectionComponentForMessageRequest
    | SeparatorComponentForMessageRequest
    | TextDisplayComponentForMessageRequest
  > | null
  readonly attachments?: ReadonlyArray<MessageAttachmentRequest> | null
}

export const ReactionTypes = {
  /** Normal reaction type */
  NORMAL: 0,
  /** Burst reaction type */
  BURST: 1,
} as const
export type ReactionTypes = (typeof ReactionTypes)[keyof typeof ReactionTypes]

export interface ListMessageReactionsByEmojiParams {
  readonly after?: SnowflakeType
  readonly limit?: number
  readonly type?: ReactionTypes
}

export type ListMessageReactionsByEmoji200 = ReadonlyArray<UserResponse>

export interface CreateTextThreadWithMessageRequest {
  readonly name: string
  readonly auto_archive_duration?: null | ThreadAutoArchiveDuration
  readonly rate_limit_per_user?: number | null
}

export interface SetChannelPermissionOverwriteRequest {
  readonly type?: null | ChannelPermissionOverwrites
  readonly allow?: number | null
  readonly deny?: number | null
}

export type ListPinnedMessages200 = ReadonlyArray<MessageResponse>

export interface GetAnswerVotersParams {
  readonly after?: SnowflakeType
  readonly limit?: number
}

export interface PollAnswerDetailsResponse {
  readonly users?: ReadonlyArray<UserResponse> | null
}

export interface AddGroupDmUserRequest {
  readonly access_token?: string | null
  readonly nick?: string | null
}

export type AddGroupDmUser201 =
  | PrivateChannelResponse
  | PrivateGroupChannelResponse

export interface SoundboardSoundSendRequest {
  readonly sound_id: SnowflakeType
  readonly source_guild_id?: null | SnowflakeType
}

export interface ListThreadMembersParams {
  readonly with_member?: boolean
  readonly limit?: number
  readonly after?: SnowflakeType
}

export type ListThreadMembers200 = ReadonlyArray<ThreadMemberResponse>

export interface GetThreadMemberParams {
  readonly with_member?: boolean
}

export interface BaseCreateMessageCreateRequest {
  readonly content?: string | null
  readonly embeds?: ReadonlyArray<RichEmbed> | null
  readonly allowed_mentions?: null | MessageAllowedMentionsRequest
  readonly sticker_ids?: ReadonlyArray<SnowflakeType> | null
  readonly components?: ReadonlyArray<
    | ActionRowComponentForMessageRequest
    | ContainerComponentForMessageRequest
    | FileComponentForMessageRequest
    | MediaGalleryComponentForMessageRequest
    | SectionComponentForMessageRequest
    | SeparatorComponentForMessageRequest
    | TextDisplayComponentForMessageRequest
  > | null
  readonly flags?: number | null
  readonly attachments?: ReadonlyArray<MessageAttachmentRequest> | null
  readonly poll?: null | PollCreateRequest
  readonly confetti_potion?: null | ConfettiPotionCreateRequest
}

export interface CreateForumThreadRequest {
  readonly name: string
  readonly auto_archive_duration?: null | ThreadAutoArchiveDuration
  readonly rate_limit_per_user?: number | null
  readonly applied_tags?: ReadonlyArray<SnowflakeType> | null
  readonly message: BaseCreateMessageCreateRequest
}

export interface CreateTextThreadWithoutMessageRequest {
  readonly name: string
  readonly auto_archive_duration?: null | ThreadAutoArchiveDuration
  readonly rate_limit_per_user?: number | null
  readonly type?: null | 10 | 11 | 12
  readonly invitable?: boolean | null
}

export type CreateThreadRequest =
  | CreateForumThreadRequest
  | CreateTextThreadWithoutMessageRequest

export interface CreatedThreadResponse {
  readonly id: SnowflakeType
  readonly type: 10 | 11 | 12
  readonly last_message_id?: null | SnowflakeType
  readonly flags: number
  readonly last_pin_timestamp?: string | null
  readonly guild_id: SnowflakeType
  readonly name: string
  readonly parent_id?: null | SnowflakeType
  readonly rate_limit_per_user?: number | null
  readonly bitrate?: number | null
  readonly user_limit?: number | null
  readonly rtc_region?: string | null
  readonly video_quality_mode?: null | VideoQualityModes
  readonly permissions?: string | null
  readonly owner_id: SnowflakeType
  readonly thread_metadata?: null | ThreadMetadataResponse
  readonly message_count: number
  readonly member_count: number
  readonly total_message_sent: number
  readonly applied_tags?: ReadonlyArray<SnowflakeType> | null
  readonly member?: null | ThreadMemberResponse
}

export interface ListPrivateArchivedThreadsParams {
  readonly before?: string
  readonly limit?: number
}

export interface ThreadsResponse {
  readonly threads: ReadonlyArray<ThreadResponse>
  readonly members: ReadonlyArray<ThreadMemberResponse>
  readonly has_more?: boolean | null
  readonly first_messages?: ReadonlyArray<MessageResponse> | null
}

export interface ListPublicArchivedThreadsParams {
  readonly before?: string
  readonly limit?: number
}

export const ThreadSortingMode = {
  RELEVANCE: "relevance",
  CREATION_TIME: "creation_time",
  LAST_MESSAGE_TIME: "last_message_time",
  ARCHIVE_TIME: "archive_time",
} as const
export type ThreadSortingMode =
  (typeof ThreadSortingMode)[keyof typeof ThreadSortingMode]

export const SortingOrder = {
  ASC: "asc",
  DESC: "desc",
} as const
export type SortingOrder = (typeof SortingOrder)[keyof typeof SortingOrder]

export interface ThreadSearchParams {
  readonly name?: string
  readonly slop?: number
  readonly min_id?: SnowflakeType
  readonly max_id?: SnowflakeType
  readonly tag?: string | ReadonlyArray<SnowflakeType>
  readonly tag_setting?: ThreadSearchTagSetting
  readonly archived?: boolean
  readonly sort_by?: ThreadSortingMode
  readonly sort_order?: SortingOrder
  readonly limit?: number
  readonly offset?: number
}

export interface ThreadSearchResponse {
  readonly threads: ReadonlyArray<ThreadResponse>
  readonly members: ReadonlyArray<ThreadMemberResponse>
  readonly has_more?: boolean | null
  readonly first_messages?: ReadonlyArray<MessageResponse> | null
  readonly total_results?: number | null
}

export interface TypingIndicatorResponse {}

export interface ListMyPrivateArchivedThreadsParams {
  readonly before?: SnowflakeType
  readonly limit?: number
}

export const WebhookTypes = {
  /** Incoming Webhooks can post messages to channels with a generated token */
  GUILD_INCOMING: 1,
  /** Channel Follower Webhooks are internal webhooks used with Channel Following to post new messages into channels */
  CHANNEL_FOLLOWER: 2,
  /** Application webhooks are webhooks used with Interactions */
  APPLICATION_INCOMING: 3,
} as const
export type WebhookTypes = (typeof WebhookTypes)[keyof typeof WebhookTypes]

export interface ApplicationIncomingWebhookResponse {
  readonly application_id?: null | SnowflakeType
  readonly avatar?: string | null
  readonly channel_id?: null | SnowflakeType
  readonly guild_id?: null | SnowflakeType
  readonly id: SnowflakeType
  readonly name: string
  readonly type: 3
  readonly user?: null | UserResponse
}

export interface WebhookSourceGuildResponse {
  readonly id: SnowflakeType
  readonly icon?: string | null
  readonly name: string
}

export interface WebhookSourceChannelResponse {
  readonly id: SnowflakeType
  readonly name: string
}

export interface ChannelFollowerWebhookResponse {
  readonly application_id?: null | SnowflakeType
  readonly avatar?: string | null
  readonly channel_id?: null | SnowflakeType
  readonly guild_id?: null | SnowflakeType
  readonly id: SnowflakeType
  readonly name: string
  readonly type: 2
  readonly user?: null | UserResponse
  readonly source_guild?: null | WebhookSourceGuildResponse
  readonly source_channel?: null | WebhookSourceChannelResponse
}

export interface GuildIncomingWebhookResponse {
  readonly application_id?: null | SnowflakeType
  readonly avatar?: string | null
  readonly channel_id?: null | SnowflakeType
  readonly guild_id?: null | SnowflakeType
  readonly id: SnowflakeType
  readonly name: string
  readonly type: 1
  readonly user?: null | UserResponse
  readonly token?: string | null
  readonly url?: string | null
}

export type ListChannelWebhooks200 = ReadonlyArray<
  | ApplicationIncomingWebhookResponse
  | ChannelFollowerWebhookResponse
  | GuildIncomingWebhookResponse
>

export interface CreateWebhookRequest {
  readonly name: string
  readonly avatar?: string | null
}

export interface GatewayResponse {
  readonly url: string
}

export interface GatewayBotSessionStartLimitResponse {
  readonly max_concurrency: number
  readonly remaining: number
  readonly reset_after: number
  readonly total: number
}

export interface GatewayBotResponse {
  readonly url: string
  readonly session_start_limit: GatewayBotSessionStartLimitResponse
  readonly shards: number
}

export const UserNotificationSettings = {
  /** members will receive notifications for all messages by default */
  ALL_MESSAGES: 0,
  /** members will receive notifications only for messages that @mention them by default */
  ONLY_MENTIONS: 1,
} as const
export type UserNotificationSettings =
  (typeof UserNotificationSettings)[keyof typeof UserNotificationSettings]

export const GuildExplicitContentFilterTypes = {
  /** media content will not be scanned */
  DISABLED: 0,
  /** media content sent by members without roles will be scanned */
  MEMBERS_WITHOUT_ROLES: 1,
  /** media content sent by all members will be scanned */
  ALL_MEMBERS: 2,
} as const
export type GuildExplicitContentFilterTypes =
  (typeof GuildExplicitContentFilterTypes)[keyof typeof GuildExplicitContentFilterTypes]

export const AvailableLocalesEnum = {
  /** The ar locale */
  ar: "ar",
  /** The bg locale */
  bg: "bg",
  /** The cs locale */
  cs: "cs",
  /** The da locale */
  da: "da",
  /** The de locale */
  de: "de",
  /** The el locale */
  el: "el",
  /** The en-GB locale */
  "en-GB": "en-GB",
  /** The en-US locale */
  "en-US": "en-US",
  /** The es-419 locale */
  "es-419": "es-419",
  /** The es-ES locale */
  "es-ES": "es-ES",
  /** The fi locale */
  fi: "fi",
  /** The fr locale */
  fr: "fr",
  /** The he locale */
  he: "he",
  /** The hi locale */
  hi: "hi",
  /** The hr locale */
  hr: "hr",
  /** The hu locale */
  hu: "hu",
  /** The id locale */
  id: "id",
  /** The it locale */
  it: "it",
  /** The ja locale */
  ja: "ja",
  /** The ko locale */
  ko: "ko",
  /** The lt locale */
  lt: "lt",
  /** The nl locale */
  nl: "nl",
  /** The no locale */
  no: "no",
  /** The pl locale */
  pl: "pl",
  /** The pt-BR locale */
  "pt-BR": "pt-BR",
  /** The ro locale */
  ro: "ro",
  /** The ru locale */
  ru: "ru",
  /** The sv-SE locale */
  "sv-SE": "sv-SE",
  /** The th locale */
  th: "th",
  /** The tr locale */
  tr: "tr",
  /** The uk locale */
  uk: "uk",
  /** The vi locale */
  vi: "vi",
  /** The zh-CN locale */
  "zh-CN": "zh-CN",
  /** The zh-TW locale */
  "zh-TW": "zh-TW",
} as const
export type AvailableLocalesEnum =
  (typeof AvailableLocalesEnum)[keyof typeof AvailableLocalesEnum]

export const AfkTimeouts = {
  ONE_MINUTE: 60,
  FIVE_MINUTES: 300,
  FIFTEEN_MINUTES: 900,
  THIRTY_MINUTES: 1800,
  ONE_HOUR: 3600,
} as const
export type AfkTimeouts = (typeof AfkTimeouts)[keyof typeof AfkTimeouts]

export interface CreateGuildRequestRoleItem {
  readonly id: number
  readonly name?: string | null
  readonly permissions?: number | null
  readonly color?: number | null
  readonly hoist?: boolean | null
  readonly mentionable?: boolean | null
  readonly unicode_emoji?: string | null
}

export interface CreateOrUpdateThreadTagRequest {
  readonly name: string
  readonly emoji_id?: null | SnowflakeType
  readonly emoji_name?: string | null
  readonly moderated?: boolean | null
}

export interface CreateGuildRequestChannelItem {
  readonly type?: null | 0 | 2 | 4
  readonly name: string
  readonly position?: number | null
  readonly topic?: string | null
  readonly bitrate?: number | null
  readonly user_limit?: number | null
  readonly nsfw?: boolean | null
  readonly rate_limit_per_user?: number | null
  readonly parent_id?: null | SnowflakeType
  readonly permission_overwrites?: ReadonlyArray<ChannelPermissionOverwriteRequest> | null
  readonly rtc_region?: string | null
  readonly video_quality_mode?: null | VideoQualityModes
  readonly default_auto_archive_duration?: null | ThreadAutoArchiveDuration
  readonly default_reaction_emoji?: null | UpdateDefaultReactionEmojiRequest
  readonly default_thread_rate_limit_per_user?: number | null
  readonly default_sort_order?: null | ThreadSortOrder
  readonly default_forum_layout?: null | ForumLayout
  readonly default_tag_setting?: null | ThreadSearchTagSetting
  readonly id?: null | SnowflakeType
  readonly available_tags?: ReadonlyArray<CreateOrUpdateThreadTagRequest> | null
}

export interface GuildCreateRequest {
  readonly description?: string | null
  readonly name: string
  readonly region?: string | null
  readonly icon?: string | null
  readonly verification_level?: null | VerificationLevels
  readonly default_message_notifications?: null | UserNotificationSettings
  readonly explicit_content_filter?: null | GuildExplicitContentFilterTypes
  readonly preferred_locale?: null | AvailableLocalesEnum
  readonly afk_timeout?: null | AfkTimeouts
  readonly roles?: ReadonlyArray<CreateGuildRequestRoleItem> | null
  readonly channels?: ReadonlyArray<CreateGuildRequestChannelItem> | null
  readonly afk_channel_id?: null | SnowflakeType
  readonly system_channel_id?: null | SnowflakeType
  readonly system_channel_flags?: number | null
}

export interface GuildRoleTagsResponse {
  readonly premium_subscriber?: null
  readonly bot_id?: null | SnowflakeType
  readonly integration_id?: null | SnowflakeType
  readonly subscription_listing_id?: null | SnowflakeType
  readonly available_for_purchase?: null
  readonly guild_connections?: null
}

export interface GuildRoleResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly description?: string | null
  readonly permissions: string
  readonly position: number
  readonly color: number
  readonly hoist: boolean
  readonly managed: boolean
  readonly mentionable: boolean
  readonly icon?: string | null
  readonly unicode_emoji?: string | null
  readonly tags?: null | GuildRoleTagsResponse
}

export const GuildMFALevel = {
  /** Guild has no MFA/2FA requirement for moderation actions */
  NONE: 0,
  /** Guild has a 2FA requirement for moderation actions */
  ELEVATED: 1,
} as const
export type GuildMFALevel = (typeof GuildMFALevel)[keyof typeof GuildMFALevel]

export const PremiumGuildTiers = {
  /** Guild has not unlocked any Server Boost perks */
  NONE: 0,
  /** Guild has unlocked Server Boost level 1 perks */
  TIER_1: 1,
  /** Guild has unlocked Server Boost level 2 perks */
  TIER_2: 2,
  /** Guild has unlocked Server Boost level 3 perks */
  TIER_3: 3,
} as const
export type PremiumGuildTiers =
  (typeof PremiumGuildTiers)[keyof typeof PremiumGuildTiers]

export interface GuildResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly icon?: string | null
  readonly description?: string | null
  readonly home_header?: string | null
  readonly splash?: string | null
  readonly discovery_splash?: string | null
  readonly features: ReadonlyArray<GuildFeatures>
  readonly banner?: string | null
  readonly owner_id: SnowflakeType
  readonly application_id?: null | SnowflakeType
  readonly region: string
  readonly afk_channel_id?: null | SnowflakeType
  readonly afk_timeout: AfkTimeouts
  readonly system_channel_id?: null | SnowflakeType
  readonly system_channel_flags: number
  readonly widget_enabled: boolean
  readonly widget_channel_id?: null | SnowflakeType
  readonly verification_level: VerificationLevels
  readonly roles: ReadonlyArray<GuildRoleResponse>
  readonly default_message_notifications: UserNotificationSettings
  readonly mfa_level: GuildMFALevel
  readonly explicit_content_filter: GuildExplicitContentFilterTypes
  readonly max_presences?: number | null
  readonly max_members?: number | null
  readonly max_stage_video_channel_users?: number | null
  readonly max_video_channel_users?: number | null
  readonly vanity_url_code?: string | null
  readonly premium_tier: PremiumGuildTiers
  readonly premium_subscription_count: number
  readonly preferred_locale: AvailableLocalesEnum
  readonly rules_channel_id?: null | SnowflakeType
  readonly safety_alerts_channel_id?: null | SnowflakeType
  readonly public_updates_channel_id?: null | SnowflakeType
  readonly premium_progress_bar_enabled: boolean
  readonly nsfw: boolean
  readonly nsfw_level: GuildNSFWContentLevel
  readonly emojis: ReadonlyArray<EmojiResponse>
  readonly stickers: ReadonlyArray<GuildStickerResponse>
}

export interface GuildTemplateRoleResponse {
  readonly id: number
  readonly name: string
  readonly permissions: string
  readonly color: number
  readonly hoist: boolean
  readonly mentionable: boolean
  readonly icon?: string | null
  readonly unicode_emoji?: string | null
}

export interface GuildTemplateChannelTags {
  readonly name: string
  readonly emoji_id?: null | SnowflakeType
  readonly emoji_name?: string | null
  readonly moderated?: boolean | null
}

export interface IconEmojiResponse {}

export interface GuildTemplateChannelResponse {
  readonly id?: number | null
  readonly type: 0 | 2 | 4
  readonly name?: string | null
  readonly position?: number | null
  readonly topic?: string | null
  readonly bitrate: number
  readonly user_limit: number
  readonly nsfw: boolean
  readonly rate_limit_per_user: number
  readonly parent_id?: null | SnowflakeType
  readonly default_auto_archive_duration?: null | ThreadAutoArchiveDuration
  readonly permission_overwrites: ReadonlyArray<null | ChannelPermissionOverwriteResponse>
  readonly available_tags?: ReadonlyArray<GuildTemplateChannelTags> | null
  readonly template: string
  readonly default_reaction_emoji?: null | DefaultReactionEmojiResponse
  readonly default_thread_rate_limit_per_user?: number | null
  readonly default_sort_order?: null | ThreadSortOrder
  readonly default_forum_layout?: null | ForumLayout
  readonly default_tag_setting?: null | ThreadSearchTagSetting
  readonly icon_emoji?: null | IconEmojiResponse
  readonly theme_color?: number | null
}

export interface GuildTemplateSnapshotResponse {
  readonly name: string
  readonly description?: string | null
  readonly region?: string | null
  readonly verification_level: VerificationLevels
  readonly default_message_notifications: UserNotificationSettings
  readonly explicit_content_filter: GuildExplicitContentFilterTypes
  readonly preferred_locale: AvailableLocalesEnum
  readonly afk_channel_id?: null | SnowflakeType
  readonly afk_timeout: AfkTimeouts
  readonly system_channel_id?: null | SnowflakeType
  readonly system_channel_flags: number
  readonly roles: ReadonlyArray<GuildTemplateRoleResponse>
  readonly channels: ReadonlyArray<GuildTemplateChannelResponse>
}

export interface GuildTemplateResponse {
  readonly code: string
  readonly name: string
  readonly description?: string | null
  readonly usage_count: number
  readonly creator_id: SnowflakeType
  readonly creator?: null | UserResponse
  readonly created_at: string
  readonly updated_at: string
  readonly source_guild_id: SnowflakeType
  readonly serialized_source_guild: GuildTemplateSnapshotResponse
  readonly is_dirty?: boolean | null
}

export interface CreateGuildFromTemplateRequest {
  readonly name: string
  readonly icon?: string | null
}

export interface GetGuildParams {
  readonly with_counts?: boolean
}

export interface GuildWithCountsResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly icon?: string | null
  readonly description?: string | null
  readonly home_header?: string | null
  readonly splash?: string | null
  readonly discovery_splash?: string | null
  readonly features: ReadonlyArray<GuildFeatures>
  readonly banner?: string | null
  readonly owner_id: SnowflakeType
  readonly application_id?: null | SnowflakeType
  readonly region: string
  readonly afk_channel_id?: null | SnowflakeType
  readonly afk_timeout: AfkTimeouts
  readonly system_channel_id?: null | SnowflakeType
  readonly system_channel_flags: number
  readonly widget_enabled: boolean
  readonly widget_channel_id?: null | SnowflakeType
  readonly verification_level: VerificationLevels
  readonly roles: ReadonlyArray<GuildRoleResponse>
  readonly default_message_notifications: UserNotificationSettings
  readonly mfa_level: GuildMFALevel
  readonly explicit_content_filter: GuildExplicitContentFilterTypes
  readonly max_presences?: number | null
  readonly max_members?: number | null
  readonly max_stage_video_channel_users?: number | null
  readonly max_video_channel_users?: number | null
  readonly vanity_url_code?: string | null
  readonly premium_tier: PremiumGuildTiers
  readonly premium_subscription_count: number
  readonly preferred_locale: AvailableLocalesEnum
  readonly rules_channel_id?: null | SnowflakeType
  readonly safety_alerts_channel_id?: null | SnowflakeType
  readonly public_updates_channel_id?: null | SnowflakeType
  readonly premium_progress_bar_enabled: boolean
  readonly nsfw: boolean
  readonly nsfw_level: GuildNSFWContentLevel
  readonly emojis: ReadonlyArray<EmojiResponse>
  readonly stickers: ReadonlyArray<GuildStickerResponse>
  readonly approximate_member_count?: number | null
  readonly approximate_presence_count?: number | null
}

export interface GuildPatchRequestPartial {
  readonly name?: string
  readonly description?: string | null
  readonly region?: string | null
  readonly icon?: string | null
  readonly verification_level?: null | VerificationLevels
  readonly default_message_notifications?: null | UserNotificationSettings
  readonly explicit_content_filter?: null | GuildExplicitContentFilterTypes
  readonly preferred_locale?: null | AvailableLocalesEnum
  readonly afk_timeout?: null | AfkTimeouts
  readonly afk_channel_id?: null | SnowflakeType
  readonly system_channel_id?: null | SnowflakeType
  readonly owner_id?: SnowflakeType
  readonly splash?: string | null
  readonly banner?: string | null
  readonly system_channel_flags?: number | null
  readonly features?: ReadonlyArray<string> | null
  readonly discovery_splash?: string | null
  readonly home_header?: string | null
  readonly rules_channel_id?: null | SnowflakeType
  readonly safety_alerts_channel_id?: null | SnowflakeType
  readonly public_updates_channel_id?: null | SnowflakeType
  readonly premium_progress_bar_enabled?: boolean | null
}

export interface ListGuildAuditLogEntriesParams {
  readonly user_id?: SnowflakeType
  readonly target_id?: SnowflakeType
  readonly action_type?: number
  readonly before?: SnowflakeType
  readonly after?: SnowflakeType
  readonly limit?: number
}

export const AuditLogActionTypes = {
  GUILD_UPDATE: 1,
  CHANNEL_CREATE: 10,
  CHANNEL_UPDATE: 11,
  CHANNEL_DELETE: 12,
  CHANNEL_OVERWRITE_CREATE: 13,
  CHANNEL_OVERWRITE_UPDATE: 14,
  CHANNEL_OVERWRITE_DELETE: 15,
  MEMBER_KICK: 20,
  MEMBER_PRUNE: 21,
  MEMBER_BAN_ADD: 22,
  MEMBER_BAN_REMOVE: 23,
  MEMBER_UPDATE: 24,
  MEMBER_ROLE_UPDATE: 25,
  MEMBER_MOVE: 26,
  MEMBER_DISCONNECT: 27,
  BOT_ADD: 28,
  ROLE_CREATE: 30,
  ROLE_UPDATE: 31,
  ROLE_DELETE: 32,
  INVITE_CREATE: 40,
  INVITE_UPDATE: 41,
  INVITE_DELETE: 42,
  WEBHOOK_CREATE: 50,
  WEBHOOK_UPDATE: 51,
  WEBHOOK_DELETE: 52,
  EMOJI_CREATE: 60,
  EMOJI_UPDATE: 61,
  EMOJI_DELETE: 62,
  MESSAGE_DELETE: 72,
  MESSAGE_BULK_DELETE: 73,
  MESSAGE_PIN: 74,
  MESSAGE_UNPIN: 75,
  INTEGRATION_CREATE: 80,
  INTEGRATION_UPDATE: 81,
  INTEGRATION_DELETE: 82,
  STAGE_INSTANCE_CREATE: 83,
  STAGE_INSTANCE_UPDATE: 84,
  STAGE_INSTANCE_DELETE: 85,
  STICKER_CREATE: 90,
  STICKER_UPDATE: 91,
  STICKER_DELETE: 92,
  GUILD_SCHEDULED_EVENT_CREATE: 100,
  GUILD_SCHEDULED_EVENT_UPDATE: 101,
  GUILD_SCHEDULED_EVENT_DELETE: 102,
  THREAD_CREATE: 110,
  THREAD_UPDATE: 111,
  THREAD_DELETE: 112,
  APPLICATION_COMMAND_PERMISSION_UPDATE: 121,
  SOUNDBOARD_SOUND_CREATE: 130,
  SOUNDBOARD_SOUND_UPDATE: 131,
  SOUNDBOARD_SOUND_DELETE: 132,
  AUTO_MODERATION_RULE_CREATE: 140,
  AUTO_MODERATION_RULE_UPDATE: 141,
  AUTO_MODERATION_RULE_DELETE: 142,
  AUTO_MODERATION_BLOCK_MESSAGE: 143,
  AUTO_MODERATION_FLAG_TO_CHANNEL: 144,
  AUTO_MODERATION_USER_COMM_DISABLED: 145,
  AUTO_MODERATION_QUARANTINE_USER: 146,
  CREATOR_MONETIZATION_REQUEST_CREATED: 150,
  CREATOR_MONETIZATION_TERMS_ACCEPTED: 151,
  ONBOARDING_PROMPT_CREATE: 163,
  ONBOARDING_PROMPT_UPDATE: 164,
  ONBOARDING_PROMPT_DELETE: 165,
  ONBOARDING_CREATE: 166,
  ONBOARDING_UPDATE: 167,
  GUILD_HOME_FEATURE_ITEM: 171,
  GUILD_HOME_REMOVE_ITEM: 172,
  HARMFUL_LINKS_BLOCKED_MESSAGE: 180,
  HOME_SETTINGS_CREATE: 190,
  HOME_SETTINGS_UPDATE: 191,
  VOICE_CHANNEL_STATUS_CREATE: 192,
  VOICE_CHANNEL_STATUS_DELETE: 193,
  GUILD_PROFILE_UPDATE: 211,
} as const
export type AuditLogActionTypes =
  (typeof AuditLogActionTypes)[keyof typeof AuditLogActionTypes]

export interface AuditLogObjectChangeResponse {
  readonly key?: string | null
}

export interface AuditLogEntryResponse {
  readonly id: SnowflakeType
  readonly action_type: AuditLogActionTypes
  readonly user_id?: null | SnowflakeType
  readonly target_id?: null | SnowflakeType
  readonly changes?: ReadonlyArray<AuditLogObjectChangeResponse> | null
  readonly options?: Record<string, unknown> | null
  readonly reason?: string | null
}

export const IntegrationTypes = {
  DISCORD: "discord",
  TWITCH: "twitch",
  YOUTUBE: "youtube",
  GUILD_SUBSCRIPTION: "guild_subscription",
} as const
export type IntegrationTypes =
  (typeof IntegrationTypes)[keyof typeof IntegrationTypes]

export interface AccountResponse {
  readonly id: string
  readonly name?: string | null
}

export interface PartialDiscordIntegrationResponse {
  readonly id: SnowflakeType
  readonly type: "discord"
  readonly name?: string | null
  readonly account?: null | AccountResponse
  readonly application_id: SnowflakeType
}

export interface PartialExternalConnectionIntegrationResponse {
  readonly id: SnowflakeType
  readonly type: "twitch" | "youtube"
  readonly name?: string | null
  readonly account?: null | AccountResponse
}

export interface PartialGuildSubscriptionIntegrationResponse {
  readonly id: SnowflakeType
  readonly type: "guild_subscription"
  readonly name?: string | null
  readonly account?: null | AccountResponse
}

export interface EntityMetadataExternalResponse {
  readonly location: string
}

export interface ExternalScheduledEventResponse {
  readonly id: SnowflakeType
  readonly guild_id: SnowflakeType
  readonly name: string
  readonly description?: string | null
  readonly channel_id?: null | SnowflakeType
  readonly creator_id?: null | SnowflakeType
  readonly creator?: null | UserResponse
  readonly image?: string | null
  readonly scheduled_start_time: string
  readonly scheduled_end_time?: string | null
  readonly status: GuildScheduledEventStatuses
  readonly entity_type: 3
  readonly entity_id?: null | SnowflakeType
  readonly user_count?: number | null
  readonly privacy_level: GuildScheduledEventPrivacyLevels
  readonly user_rsvp?: null | ScheduledEventUserResponse
  readonly entity_metadata: EntityMetadataExternalResponse
}

export interface EntityMetadataStageInstanceResponse {}

export interface StageScheduledEventResponse {
  readonly id: SnowflakeType
  readonly guild_id: SnowflakeType
  readonly name: string
  readonly description?: string | null
  readonly channel_id?: null | SnowflakeType
  readonly creator_id?: null | SnowflakeType
  readonly creator?: null | UserResponse
  readonly image?: string | null
  readonly scheduled_start_time: string
  readonly scheduled_end_time?: string | null
  readonly status: GuildScheduledEventStatuses
  readonly entity_type: 1
  readonly entity_id?: null | SnowflakeType
  readonly user_count?: number | null
  readonly privacy_level: GuildScheduledEventPrivacyLevels
  readonly user_rsvp?: null | ScheduledEventUserResponse
  readonly entity_metadata?: null | EntityMetadataStageInstanceResponse
}

export interface EntityMetadataVoiceResponse {}

export interface VoiceScheduledEventResponse {
  readonly id: SnowflakeType
  readonly guild_id: SnowflakeType
  readonly name: string
  readonly description?: string | null
  readonly channel_id?: null | SnowflakeType
  readonly creator_id?: null | SnowflakeType
  readonly creator?: null | UserResponse
  readonly image?: string | null
  readonly scheduled_start_time: string
  readonly scheduled_end_time?: string | null
  readonly status: GuildScheduledEventStatuses
  readonly entity_type: 2
  readonly entity_id?: null | SnowflakeType
  readonly user_count?: number | null
  readonly privacy_level: GuildScheduledEventPrivacyLevels
  readonly user_rsvp?: null | ScheduledEventUserResponse
  readonly entity_metadata?: null | EntityMetadataVoiceResponse
}

export const AutomodEventType = {
  /** A user submitted a message to a channel */
  MESSAGE_SEND: 1,
  /** A user is attempting to join the server or a member's properties were updated. */
  GUILD_MEMBER_JOIN_OR_UPDATE: 2,
} as const
export type AutomodEventType =
  (typeof AutomodEventType)[keyof typeof AutomodEventType]

export const AutomodActionType = {
  /** Block a user's message and prevent it from being posted. A custom explanation can be specified and shown to members whenever their message is blocked */
  BLOCK_MESSAGE: 1,
  /** Send a system message to a channel in order to log the user message that triggered the rule */
  FLAG_TO_CHANNEL: 2,
  /** Temporarily disable a user's ability to communicate in the server (timeout) */
  USER_COMMUNICATION_DISABLED: 3,
  /** Prevent a user from interacting in the server */
  QUARANTINE_USER: 4,
} as const
export type AutomodActionType =
  (typeof AutomodActionType)[keyof typeof AutomodActionType]

export interface BlockMessageActionMetadataResponse {
  readonly custom_message?: string | null
}

export interface BlockMessageActionResponse {
  readonly type: 1
  readonly metadata: BlockMessageActionMetadataResponse
}

export interface FlagToChannelActionMetadataResponse {
  readonly channel_id: SnowflakeType
}

export interface FlagToChannelActionResponse {
  readonly type: 2
  readonly metadata: FlagToChannelActionMetadataResponse
}

export interface QuarantineUserActionMetadataResponse {}

export interface QuarantineUserActionResponse {
  readonly type: 4
  readonly metadata: QuarantineUserActionMetadataResponse
}

export interface UserCommunicationDisabledActionMetadataResponse {
  readonly duration_seconds: number
}

export interface UserCommunicationDisabledActionResponse {
  readonly type: 3
  readonly metadata: UserCommunicationDisabledActionMetadataResponse
}

export const AutomodTriggerType = {
  /** Check if content contains words from a list of keywords or matches regex */
  KEYWORD: 1,
  /** DEPRECATED */
  SPAM_LINK: 2,
  /** Check if content represents generic spam */
  ML_SPAM: 3,
  /** Check if content contains words from internal pre-defined wordsets */
  DEFAULT_KEYWORD_LIST: 4,
  /** Check if content contains more unique mentions than allowed */
  MENTION_SPAM: 5,
} as const
export type AutomodTriggerType =
  (typeof AutomodTriggerType)[keyof typeof AutomodTriggerType]

export const AutomodKeywordPresetType = {
  /** Words and phrases that may be considered profanity */
  PROFANITY: 1,
  /** Words and phrases that may be considered as sexual content */
  SEXUAL_CONTENT: 2,
  /** Words and phrases that may be considered slurs and hate speech */
  SLURS: 3,
} as const
export type AutomodKeywordPresetType =
  (typeof AutomodKeywordPresetType)[keyof typeof AutomodKeywordPresetType]

export interface DefaultKeywordListTriggerMetadataResponse {
  readonly allow_list: ReadonlyArray<string>
  readonly presets: ReadonlyArray<AutomodKeywordPresetType>
}

export interface DefaultKeywordRuleResponse {
  readonly id: SnowflakeType
  readonly guild_id: SnowflakeType
  readonly creator_id: SnowflakeType
  readonly name: string
  readonly event_type: AutomodEventType
  readonly actions: ReadonlyArray<
    | BlockMessageActionResponse
    | FlagToChannelActionResponse
    | QuarantineUserActionResponse
    | UserCommunicationDisabledActionResponse
  >
  readonly trigger_type: 4
  readonly enabled?: boolean | null
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null
  readonly trigger_metadata: DefaultKeywordListTriggerMetadataResponse
}

export interface KeywordTriggerMetadataResponse {
  readonly keyword_filter: ReadonlyArray<string>
  readonly regex_patterns: ReadonlyArray<string>
  readonly allow_list: ReadonlyArray<string>
}

export interface KeywordRuleResponse {
  readonly id: SnowflakeType
  readonly guild_id: SnowflakeType
  readonly creator_id: SnowflakeType
  readonly name: string
  readonly event_type: AutomodEventType
  readonly actions: ReadonlyArray<
    | BlockMessageActionResponse
    | FlagToChannelActionResponse
    | QuarantineUserActionResponse
    | UserCommunicationDisabledActionResponse
  >
  readonly trigger_type: 1
  readonly enabled?: boolean | null
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null
  readonly trigger_metadata: KeywordTriggerMetadataResponse
}

export interface MLSpamTriggerMetadataResponse {}

export interface MLSpamRuleResponse {
  readonly id: SnowflakeType
  readonly guild_id: SnowflakeType
  readonly creator_id: SnowflakeType
  readonly name: string
  readonly event_type: AutomodEventType
  readonly actions: ReadonlyArray<
    | BlockMessageActionResponse
    | FlagToChannelActionResponse
    | QuarantineUserActionResponse
    | UserCommunicationDisabledActionResponse
  >
  readonly trigger_type: 3
  readonly enabled?: boolean | null
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null
  readonly trigger_metadata: MLSpamTriggerMetadataResponse
}

export interface MentionSpamTriggerMetadataResponse {
  readonly mention_total_limit: number
  readonly mention_raid_protection_enabled?: boolean | null
}

export interface MentionSpamRuleResponse {
  readonly id: SnowflakeType
  readonly guild_id: SnowflakeType
  readonly creator_id: SnowflakeType
  readonly name: string
  readonly event_type: AutomodEventType
  readonly actions: ReadonlyArray<
    | BlockMessageActionResponse
    | FlagToChannelActionResponse
    | QuarantineUserActionResponse
    | UserCommunicationDisabledActionResponse
  >
  readonly trigger_type: 5
  readonly enabled?: boolean | null
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null
  readonly trigger_metadata: MentionSpamTriggerMetadataResponse
}

export interface SpamLinkTriggerMetadataResponse {}

export interface SpamLinkRuleResponse {
  readonly id: SnowflakeType
  readonly guild_id: SnowflakeType
  readonly creator_id: SnowflakeType
  readonly name: string
  readonly event_type: AutomodEventType
  readonly actions: ReadonlyArray<
    | BlockMessageActionResponse
    | FlagToChannelActionResponse
    | QuarantineUserActionResponse
    | UserCommunicationDisabledActionResponse
  >
  readonly trigger_type: 2
  readonly enabled?: boolean | null
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null
  readonly trigger_metadata: SpamLinkTriggerMetadataResponse
}

export interface GuildAuditLogResponse {
  readonly audit_log_entries: ReadonlyArray<AuditLogEntryResponse>
  readonly users: ReadonlyArray<UserResponse>
  readonly integrations: ReadonlyArray<
    | PartialDiscordIntegrationResponse
    | PartialExternalConnectionIntegrationResponse
    | PartialGuildSubscriptionIntegrationResponse
  >
  readonly webhooks: ReadonlyArray<
    | ApplicationIncomingWebhookResponse
    | ChannelFollowerWebhookResponse
    | GuildIncomingWebhookResponse
  >
  readonly guild_scheduled_events: ReadonlyArray<
    | ExternalScheduledEventResponse
    | StageScheduledEventResponse
    | VoiceScheduledEventResponse
  >
  readonly threads: ReadonlyArray<ThreadResponse>
  readonly application_commands: ReadonlyArray<ApplicationCommandResponse>
  readonly auto_moderation_rules: ReadonlyArray<
    | DefaultKeywordRuleResponse
    | KeywordRuleResponse
    | MLSpamRuleResponse
    | MentionSpamRuleResponse
    | SpamLinkRuleResponse
    | null
  >
}

export type ListAutoModerationRules200 = ReadonlyArray<
  | DefaultKeywordRuleResponse
  | KeywordRuleResponse
  | MLSpamRuleResponse
  | MentionSpamRuleResponse
  | SpamLinkRuleResponse
  | null
>

export interface BlockMessageActionMetadata {
  readonly custom_message?: string | null
}

export interface BlockMessageAction {
  readonly type: 1
  readonly metadata?: null | BlockMessageActionMetadata
}

export interface FlagToChannelActionMetadata {
  readonly channel_id: SnowflakeType
}

export interface FlagToChannelAction {
  readonly type: 2
  readonly metadata: FlagToChannelActionMetadata
}

export interface QuarantineUserActionMetadata {}

export interface QuarantineUserAction {
  readonly type: 4
  readonly metadata?: null | QuarantineUserActionMetadata
}

export interface UserCommunicationDisabledActionMetadata {
  readonly duration_seconds?: number | null
}

export interface UserCommunicationDisabledAction {
  readonly type: 3
  readonly metadata: UserCommunicationDisabledActionMetadata
}

export interface DefaultKeywordListTriggerMetadata {
  readonly allow_list?: ReadonlyArray<string> | null
  readonly presets?: ReadonlyArray<AutomodKeywordPresetType> | null
}

export interface DefaultKeywordListUpsertRequest {
  readonly name: string
  readonly event_type: AutomodEventType
  readonly actions?: ReadonlyArray<
    | BlockMessageAction
    | FlagToChannelAction
    | QuarantineUserAction
    | UserCommunicationDisabledAction
  > | null
  readonly enabled?: boolean | null
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null
  readonly trigger_type: 4
  readonly trigger_metadata: DefaultKeywordListTriggerMetadata
}

export interface KeywordTriggerMetadata {
  readonly keyword_filter?: ReadonlyArray<string> | null
  readonly regex_patterns?: ReadonlyArray<string> | null
  readonly allow_list?: ReadonlyArray<string> | null
}

export interface KeywordUpsertRequest {
  readonly name: string
  readonly event_type: AutomodEventType
  readonly actions?: ReadonlyArray<
    | BlockMessageAction
    | FlagToChannelAction
    | QuarantineUserAction
    | UserCommunicationDisabledAction
  > | null
  readonly enabled?: boolean | null
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null
  readonly trigger_type: 1
  readonly trigger_metadata?: null | KeywordTriggerMetadata
}

export interface MLSpamTriggerMetadata {}

export interface MLSpamUpsertRequest {
  readonly name: string
  readonly event_type: AutomodEventType
  readonly actions?: ReadonlyArray<
    | BlockMessageAction
    | FlagToChannelAction
    | QuarantineUserAction
    | UserCommunicationDisabledAction
  > | null
  readonly enabled?: boolean | null
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null
  readonly trigger_type: 3
  readonly trigger_metadata?: null | MLSpamTriggerMetadata
}

export interface MentionSpamTriggerMetadata {
  readonly mention_total_limit: number
  readonly mention_raid_protection_enabled?: boolean | null
}

export interface MentionSpamUpsertRequest {
  readonly name: string
  readonly event_type: AutomodEventType
  readonly actions?: ReadonlyArray<
    | BlockMessageAction
    | FlagToChannelAction
    | QuarantineUserAction
    | UserCommunicationDisabledAction
  > | null
  readonly enabled?: boolean | null
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null
  readonly trigger_type: 5
  readonly trigger_metadata?: null | MentionSpamTriggerMetadata
}

export type CreateAutoModerationRuleRequest =
  | DefaultKeywordListUpsertRequest
  | KeywordUpsertRequest
  | MLSpamUpsertRequest
  | MentionSpamUpsertRequest

export type CreateAutoModerationRule200 =
  | DefaultKeywordRuleResponse
  | KeywordRuleResponse
  | MLSpamRuleResponse
  | MentionSpamRuleResponse
  | SpamLinkRuleResponse

export type GetAutoModerationRule200 =
  | DefaultKeywordRuleResponse
  | KeywordRuleResponse
  | MLSpamRuleResponse
  | MentionSpamRuleResponse
  | SpamLinkRuleResponse

export interface DefaultKeywordListUpsertRequestPartial {
  readonly name?: string
  readonly event_type?: AutomodEventType
  readonly actions?: ReadonlyArray<
    | BlockMessageAction
    | FlagToChannelAction
    | QuarantineUserAction
    | UserCommunicationDisabledAction
  > | null
  readonly enabled?: boolean | null
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null
  readonly trigger_type?: 4
  readonly trigger_metadata?: DefaultKeywordListTriggerMetadata
}

export interface KeywordUpsertRequestPartial {
  readonly name?: string
  readonly event_type?: AutomodEventType
  readonly actions?: ReadonlyArray<
    | BlockMessageAction
    | FlagToChannelAction
    | QuarantineUserAction
    | UserCommunicationDisabledAction
  > | null
  readonly enabled?: boolean | null
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null
  readonly trigger_type?: 1
  readonly trigger_metadata?: null | KeywordTriggerMetadata
}

export interface MLSpamUpsertRequestPartial {
  readonly name?: string
  readonly event_type?: AutomodEventType
  readonly actions?: ReadonlyArray<
    | BlockMessageAction
    | FlagToChannelAction
    | QuarantineUserAction
    | UserCommunicationDisabledAction
  > | null
  readonly enabled?: boolean | null
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null
  readonly trigger_type?: 3
  readonly trigger_metadata?: null | MLSpamTriggerMetadata
}

export interface MentionSpamUpsertRequestPartial {
  readonly name?: string
  readonly event_type?: AutomodEventType
  readonly actions?: ReadonlyArray<
    | BlockMessageAction
    | FlagToChannelAction
    | QuarantineUserAction
    | UserCommunicationDisabledAction
  > | null
  readonly enabled?: boolean | null
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null
  readonly trigger_type?: 5
  readonly trigger_metadata?: null | MentionSpamTriggerMetadata
}

export type UpdateAutoModerationRuleRequest =
  | DefaultKeywordListUpsertRequestPartial
  | KeywordUpsertRequestPartial
  | MLSpamUpsertRequestPartial
  | MentionSpamUpsertRequestPartial

export type UpdateAutoModerationRule200 =
  | DefaultKeywordRuleResponse
  | KeywordRuleResponse
  | MLSpamRuleResponse
  | MentionSpamRuleResponse
  | SpamLinkRuleResponse

export interface ListGuildBansParams {
  readonly limit?: number
  readonly before?: SnowflakeType
  readonly after?: SnowflakeType
}

export interface GuildBanResponse {
  readonly user: UserResponse
  readonly reason?: string | null
}

export type ListGuildBans200 = ReadonlyArray<GuildBanResponse>

export interface BanUserFromGuildRequest {
  readonly delete_message_seconds?: number | null
  readonly delete_message_days?: number | null
}

export interface BulkBanUsersFromGuildRequest {
  readonly user_ids: ReadonlyArray<SnowflakeType>
  readonly delete_message_seconds?: number | null
}

export interface BulkBanUsersResponse {
  readonly banned_users: ReadonlyArray<SnowflakeType>
  readonly failed_users: ReadonlyArray<SnowflakeType>
}

export type ListGuildChannels200 = ReadonlyArray<
  | GuildChannelResponse
  | PrivateChannelResponse
  | PrivateGroupChannelResponse
  | ThreadResponse
>

export interface CreateGuildChannelRequest {
  readonly type?: null | 0 | 2 | 4 | 5 | 13 | 14 | 15
  readonly name: string
  readonly position?: number | null
  readonly topic?: string | null
  readonly bitrate?: number | null
  readonly user_limit?: number | null
  readonly nsfw?: boolean | null
  readonly rate_limit_per_user?: number | null
  readonly parent_id?: null | SnowflakeType
  readonly permission_overwrites?: ReadonlyArray<ChannelPermissionOverwriteRequest> | null
  readonly rtc_region?: string | null
  readonly video_quality_mode?: null | VideoQualityModes
  readonly default_auto_archive_duration?: null | ThreadAutoArchiveDuration
  readonly default_reaction_emoji?: null | UpdateDefaultReactionEmojiRequest
  readonly default_thread_rate_limit_per_user?: number | null
  readonly default_sort_order?: null | ThreadSortOrder
  readonly default_forum_layout?: null | ForumLayout
  readonly default_tag_setting?: null | ThreadSearchTagSetting
  readonly available_tags?: ReadonlyArray<null | CreateOrUpdateThreadTagRequest> | null
}

export type BulkUpdateGuildChannelsRequest = ReadonlyArray<{
  readonly id?: SnowflakeType
  readonly position?: number | null
  readonly parent_id?: null | SnowflakeType
  readonly lock_permissions?: boolean | null
}>

export type ListGuildEmojis200 = ReadonlyArray<EmojiResponse>

export interface CreateGuildEmojiRequest {
  readonly name: string
  readonly image: string
  readonly roles?: ReadonlyArray<null | SnowflakeType> | null
}

export interface UpdateGuildEmojiRequest {
  readonly name?: string
  readonly roles?: ReadonlyArray<null | SnowflakeType> | null
}

export interface IntegrationApplicationResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly icon?: string | null
  readonly description: string
  readonly type?: null | ApplicationTypes
  readonly cover_image?: string | null
  readonly primary_sku_id?: null | SnowflakeType
  readonly bot?: null | UserResponse
}

export interface DiscordIntegrationResponse {
  readonly type: "discord"
  readonly name?: string | null
  readonly account?: null | AccountResponse
  readonly enabled?: boolean | null
  readonly id: SnowflakeType
  readonly application: IntegrationApplicationResponse
  readonly scopes: ReadonlyArray<
    "applications.commands" | "bot" | "webhook.incoming"
  >
  readonly user?: null | UserResponse
}

export const IntegrationExpireBehaviorTypes = {
  /** Remove role */
  REMOVE_ROLE: 0,
  /** Kick */
  KICK: 1,
} as const
export type IntegrationExpireBehaviorTypes =
  (typeof IntegrationExpireBehaviorTypes)[keyof typeof IntegrationExpireBehaviorTypes]

export const IntegrationExpireGracePeriodTypes = {
  /** 1 day */
  ONE_DAY: 1,
  /** 3 days */
  THREE_DAYS: 3,
  /** 7 days */
  SEVEN_DAYS: 7,
  /** 14 days */
  FOURTEEN_DAYS: 14,
  /** 30 days */
  THIRTY_DAYS: 30,
} as const
export type IntegrationExpireGracePeriodTypes =
  (typeof IntegrationExpireGracePeriodTypes)[keyof typeof IntegrationExpireGracePeriodTypes]

export interface ExternalConnectionIntegrationResponse {
  readonly type: "twitch" | "youtube"
  readonly name?: string | null
  readonly account?: null | AccountResponse
  readonly enabled?: boolean | null
  readonly id: string
  readonly user: UserResponse
  readonly revoked?: boolean | null
  readonly expire_behavior?: null | IntegrationExpireBehaviorTypes
  readonly expire_grace_period?: null | IntegrationExpireGracePeriodTypes
  readonly subscriber_count?: number | null
  readonly synced_at?: string | null
  readonly role_id?: null | SnowflakeType
  readonly syncing?: boolean | null
  readonly enable_emoticons?: boolean | null
}

export interface GuildSubscriptionIntegrationResponse {
  readonly type: "guild_subscription"
  readonly name?: string | null
  readonly account?: null | AccountResponse
  readonly enabled?: boolean | null
  readonly id: SnowflakeType
}

export type ListGuildIntegrations200 = ReadonlyArray<
  | DiscordIntegrationResponse
  | ExternalConnectionIntegrationResponse
  | GuildSubscriptionIntegrationResponse
>

export type ListGuildInvites200 = ReadonlyArray<
  FriendInviteResponse | GroupDMInviteResponse | GuildInviteResponse
>

export interface ListGuildMembersParams {
  readonly limit?: number
  readonly after?: number
}

export type ListGuildMembers200 = ReadonlyArray<GuildMemberResponse>

export interface UpdateMyGuildMemberRequest {
  readonly nick?: string | null
}

export interface PrivateGuildMemberResponse {
  readonly avatar?: string | null
  readonly avatar_decoration_data?: null | UserAvatarDecorationResponse
  readonly banner?: string | null
  readonly communication_disabled_until?: string | null
  readonly flags: number
  readonly joined_at: string
  readonly nick?: string | null
  readonly pending: boolean
  readonly premium_since?: string | null
  readonly roles: ReadonlyArray<SnowflakeType>
  readonly user: UserResponse
  readonly mute: boolean
  readonly deaf: boolean
}

export interface SearchGuildMembersParams {
  readonly limit: number
  readonly query: string
}

export type SearchGuildMembers200 = ReadonlyArray<GuildMemberResponse>

export interface AddGuildMemberRequest {
  readonly nick?: string | null
  readonly roles?: ReadonlyArray<null | SnowflakeType> | null
  readonly mute?: boolean | null
  readonly deaf?: boolean | null
  readonly access_token: string
  readonly flags?: number | null
}

export interface UpdateGuildMemberRequest {
  readonly nick?: string | null
  readonly roles?: ReadonlyArray<null | SnowflakeType> | null
  readonly mute?: boolean | null
  readonly deaf?: boolean | null
  readonly channel_id?: null | SnowflakeType
  readonly communication_disabled_until?: string | null
  readonly flags?: number | null
}

export interface SetGuildMfaLevelRequest {
  readonly level: GuildMFALevel
}

export interface GuildMFALevelResponse {
  readonly level: GuildMFALevel
}

export interface WelcomeMessageResponse {
  readonly author_ids: ReadonlyArray<SnowflakeType>
  readonly message: string
}

export const NewMemberActionType = {
  VIEW: 0,
  TALK: 1,
} as const
export type NewMemberActionType =
  (typeof NewMemberActionType)[keyof typeof NewMemberActionType]

export interface SettingsEmojiResponse {
  readonly id?: null | SnowflakeType
  readonly name?: string | null
  readonly animated?: boolean | null
}

export interface NewMemberActionResponse {
  readonly channel_id: SnowflakeType
  readonly action_type: NewMemberActionType
  readonly title: string
  readonly description: string
  readonly emoji?: null | SettingsEmojiResponse
  readonly icon?: string | null
}

export interface ResourceChannelResponse {
  readonly channel_id: SnowflakeType
  readonly title: string
  readonly emoji?: null | SettingsEmojiResponse
  readonly icon?: string | null
  readonly description: string
}

export interface GuildHomeSettingsResponse {
  readonly guild_id: SnowflakeType
  readonly enabled: boolean
  readonly welcome_message?: null | WelcomeMessageResponse
  readonly new_member_actions?: ReadonlyArray<null | NewMemberActionResponse> | null
  readonly resource_channels?: ReadonlyArray<null | ResourceChannelResponse> | null
}

export interface OnboardingPromptOptionResponse {
  readonly id: SnowflakeType
  readonly title: string
  readonly description: string
  readonly emoji: SettingsEmojiResponse
  readonly role_ids: ReadonlyArray<SnowflakeType>
  readonly channel_ids: ReadonlyArray<SnowflakeType>
}

export const OnboardingPromptType = {
  /** Multiple choice options */
  MULTIPLE_CHOICE: 0,
  /** Many options shown as a dropdown */
  DROPDOWN: 1,
} as const
export type OnboardingPromptType =
  (typeof OnboardingPromptType)[keyof typeof OnboardingPromptType]

export interface OnboardingPromptResponse {
  readonly id: SnowflakeType
  readonly title: string
  readonly options: ReadonlyArray<OnboardingPromptOptionResponse>
  readonly single_select: boolean
  readonly required: boolean
  readonly in_onboarding: boolean
  readonly type: OnboardingPromptType
}

export interface UserGuildOnboardingResponse {
  readonly guild_id: SnowflakeType
  readonly prompts: ReadonlyArray<OnboardingPromptResponse>
  readonly default_channel_ids: ReadonlyArray<SnowflakeType>
  readonly enabled: boolean
}

export interface OnboardingPromptOptionRequest {
  readonly id?: null | SnowflakeType
  readonly title: string
  readonly description?: string | null
  readonly emoji_id?: null | SnowflakeType
  readonly emoji_name?: string | null
  readonly emoji_animated?: boolean | null
  readonly role_ids?: ReadonlyArray<SnowflakeType> | null
  readonly channel_ids?: ReadonlyArray<SnowflakeType> | null
}

export interface UpdateOnboardingPromptRequest {
  readonly title: string
  readonly options: ReadonlyArray<OnboardingPromptOptionRequest>
  readonly single_select?: boolean | null
  readonly required?: boolean | null
  readonly in_onboarding?: boolean | null
  readonly type?: null | OnboardingPromptType
  readonly id: SnowflakeType
}

export const GuildOnboardingMode = {
  /** Only Default Channels considered in constraints */
  ONBOARDING_DEFAULT: 0,
  /** Default Channels and Onboarding Prompts considered in constraints */
  ONBOARDING_ADVANCED: 1,
} as const
export type GuildOnboardingMode =
  (typeof GuildOnboardingMode)[keyof typeof GuildOnboardingMode]

export interface UpdateGuildOnboardingRequest {
  readonly prompts?: ReadonlyArray<UpdateOnboardingPromptRequest> | null
  readonly enabled?: boolean | null
  readonly default_channel_ids?: ReadonlyArray<SnowflakeType> | null
  readonly mode?: null | GuildOnboardingMode
}

export interface GuildOnboardingResponse {
  readonly guild_id: SnowflakeType
  readonly prompts: ReadonlyArray<OnboardingPromptResponse>
  readonly default_channel_ids: ReadonlyArray<SnowflakeType>
  readonly enabled: boolean
}

export interface GuildPreviewResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly icon?: string | null
  readonly description?: string | null
  readonly home_header?: string | null
  readonly splash?: string | null
  readonly discovery_splash?: string | null
  readonly features: ReadonlyArray<GuildFeatures>
  readonly approximate_member_count: number
  readonly approximate_presence_count: number
  readonly emojis: ReadonlyArray<EmojiResponse>
  readonly stickers: ReadonlyArray<GuildStickerResponse>
}

export interface PreviewPruneGuildParams {
  readonly days?: number
  readonly include_roles?: string | ReadonlyArray<null | SnowflakeType>
}

export interface GuildPruneResponse {
  readonly pruned?: number | null
}

export interface PruneGuildRequest {
  readonly days?: number | null
  readonly compute_prune_count?: boolean | null
  readonly include_roles?: string | ReadonlyArray<null | SnowflakeType> | null
}

export interface VoiceRegionResponse {
  readonly id: string
  readonly name: string
  readonly custom: boolean
  readonly deprecated: boolean
  readonly optimal: boolean
}

export type ListGuildVoiceRegions200 = ReadonlyArray<VoiceRegionResponse>

export type ListGuildRoles200 = ReadonlyArray<GuildRoleResponse>

export interface CreateGuildRoleRequest {
  readonly name?: string | null
  readonly permissions?: number | null
  readonly color?: number | null
  readonly hoist?: boolean | null
  readonly mentionable?: boolean | null
  readonly icon?: string | null
  readonly unicode_emoji?: string | null
}

export type BulkUpdateGuildRolesRequest = ReadonlyArray<{
  readonly id?: null | SnowflakeType
  readonly position?: number | null
}>

export type BulkUpdateGuildRoles200 = ReadonlyArray<GuildRoleResponse>

export interface UpdateGuildRoleRequest {
  readonly name?: string | null
  readonly permissions?: number | null
  readonly color?: number | null
  readonly hoist?: boolean | null
  readonly mentionable?: boolean | null
  readonly icon?: string | null
  readonly unicode_emoji?: string | null
}

export interface ListGuildScheduledEventsParams {
  readonly with_user_count?: boolean
}

export type ListGuildScheduledEvents200 = ReadonlyArray<
  | ExternalScheduledEventResponse
  | StageScheduledEventResponse
  | VoiceScheduledEventResponse
>

export interface EntityMetadataExternal {
  readonly location: string
}

export interface ExternalScheduledEventCreateRequest {
  readonly name: string
  readonly description?: string | null
  readonly image?: string | null
  readonly scheduled_start_time: string
  readonly scheduled_end_time?: string | null
  readonly privacy_level: GuildScheduledEventPrivacyLevels
  readonly entity_type: 3
  readonly channel_id?: null | SnowflakeType
  readonly entity_metadata: EntityMetadataExternal
}

export interface EntityMetadataStageInstance {}

export interface StageScheduledEventCreateRequest {
  readonly name: string
  readonly description?: string | null
  readonly image?: string | null
  readonly scheduled_start_time: string
  readonly scheduled_end_time?: string | null
  readonly privacy_level: GuildScheduledEventPrivacyLevels
  readonly entity_type: 1
  readonly channel_id?: null | SnowflakeType
  readonly entity_metadata?: null | EntityMetadataStageInstance
}

export interface EntityMetadataVoice {}

export interface VoiceScheduledEventCreateRequest {
  readonly name: string
  readonly description?: string | null
  readonly image?: string | null
  readonly scheduled_start_time: string
  readonly scheduled_end_time?: string | null
  readonly privacy_level: GuildScheduledEventPrivacyLevels
  readonly entity_type: 2
  readonly channel_id?: null | SnowflakeType
  readonly entity_metadata?: null | EntityMetadataVoice
}

export type CreateGuildScheduledEventRequest =
  | ExternalScheduledEventCreateRequest
  | StageScheduledEventCreateRequest
  | VoiceScheduledEventCreateRequest

export type CreateGuildScheduledEvent200 =
  | ExternalScheduledEventResponse
  | StageScheduledEventResponse
  | VoiceScheduledEventResponse

export interface GetGuildScheduledEventParams {
  readonly with_user_count?: boolean
}

export type GetGuildScheduledEvent200 =
  | ExternalScheduledEventResponse
  | StageScheduledEventResponse
  | VoiceScheduledEventResponse

export interface ExternalScheduledEventPatchRequestPartial {
  readonly status?: null | GuildScheduledEventStatuses
  readonly name?: string
  readonly description?: string | null
  readonly image?: string | null
  readonly scheduled_start_time?: string
  readonly scheduled_end_time?: string | null
  readonly entity_type?: null | 3
  readonly privacy_level?: GuildScheduledEventPrivacyLevels
  readonly channel_id?: null | SnowflakeType
  readonly entity_metadata?: EntityMetadataExternal
}

export interface StageScheduledEventPatchRequestPartial {
  readonly status?: null | GuildScheduledEventStatuses
  readonly name?: string
  readonly description?: string | null
  readonly image?: string | null
  readonly scheduled_start_time?: string
  readonly scheduled_end_time?: string | null
  readonly entity_type?: null | 1
  readonly privacy_level?: GuildScheduledEventPrivacyLevels
  readonly channel_id?: null | SnowflakeType
  readonly entity_metadata?: null | EntityMetadataStageInstance
}

export interface VoiceScheduledEventPatchRequestPartial {
  readonly status?: null | GuildScheduledEventStatuses
  readonly name?: string
  readonly description?: string | null
  readonly image?: string | null
  readonly scheduled_start_time?: string
  readonly scheduled_end_time?: string | null
  readonly entity_type?: null | 2
  readonly privacy_level?: GuildScheduledEventPrivacyLevels
  readonly channel_id?: null | SnowflakeType
  readonly entity_metadata?: null | EntityMetadataVoice
}

export type UpdateGuildScheduledEventRequest =
  | ExternalScheduledEventPatchRequestPartial
  | StageScheduledEventPatchRequestPartial
  | VoiceScheduledEventPatchRequestPartial

export type UpdateGuildScheduledEvent200 =
  | ExternalScheduledEventResponse
  | StageScheduledEventResponse
  | VoiceScheduledEventResponse

export interface ListGuildScheduledEventUsersParams {
  readonly with_member?: boolean
  readonly limit?: number
  readonly before?: SnowflakeType
  readonly after?: SnowflakeType
}

export type ListGuildScheduledEventUsers200 =
  ReadonlyArray<ScheduledEventUserResponse>

export interface SoundboardSoundResponse {
  readonly name: string
  readonly sound_id: SnowflakeType
  readonly volume: number
  readonly emoji_id?: null | SnowflakeType
  readonly emoji_name?: string | null
  readonly guild_id?: null | SnowflakeType
  readonly available: boolean
  readonly user?: null | UserResponse
}

export interface ListGuildSoundboardSoundsResponse {
  readonly items: ReadonlyArray<SoundboardSoundResponse>
}

export interface SoundboardCreateRequest {
  readonly name: string
  readonly volume?: number | null
  readonly emoji_id?: null | SnowflakeType
  readonly emoji_name?: string | null
  readonly sound: string
}

export interface SoundboardPatchRequestPartial {
  readonly name?: string
  readonly volume?: number | null
  readonly emoji_id?: null | SnowflakeType
  readonly emoji_name?: string | null
}

export type ListGuildStickers200 = ReadonlyArray<GuildStickerResponse>

export interface UpdateGuildStickerRequest {
  readonly name?: string
  readonly tags?: string
  readonly description?: string | null
}

export type ListGuildTemplates200 = ReadonlyArray<GuildTemplateResponse>

export interface CreateGuildTemplateRequest {
  readonly name: string
  readonly description?: string | null
}

export interface UpdateGuildTemplateRequest {
  readonly name?: string
  readonly description?: string | null
}

export interface VanityURLErrorResponse {
  readonly message: string
  readonly code: number
}

export interface VanityURLResponse {
  readonly code?: string | null
  readonly uses: number
  readonly error?: null | VanityURLErrorResponse
}

export interface VoiceStateResponse {
  readonly channel_id?: null | SnowflakeType
  readonly deaf: boolean
  readonly guild_id?: null | SnowflakeType
  readonly member?: null | GuildMemberResponse
  readonly mute: boolean
  readonly request_to_speak_timestamp?: string | null
  readonly suppress: boolean
  readonly self_stream?: boolean | null
  readonly self_deaf: boolean
  readonly self_mute: boolean
  readonly self_video: boolean
  readonly session_id: string
  readonly user_id: SnowflakeType
}

export interface UpdateSelfVoiceStateRequest {
  readonly request_to_speak_timestamp?: string | null
  readonly suppress?: boolean | null
  readonly channel_id?: null | SnowflakeType
}

export interface UpdateVoiceStateRequest {
  readonly suppress?: boolean | null
  readonly channel_id?: null | SnowflakeType
}

export type GetGuildWebhooks200 = ReadonlyArray<
  | ApplicationIncomingWebhookResponse
  | ChannelFollowerWebhookResponse
  | GuildIncomingWebhookResponse
>

export interface GuildWelcomeScreenChannelResponse {
  readonly channel_id: SnowflakeType
  readonly description: string
  readonly emoji_id?: null | SnowflakeType
  readonly emoji_name?: string | null
}

export interface GuildWelcomeScreenResponse {
  readonly description?: string | null
  readonly welcome_channels: ReadonlyArray<GuildWelcomeScreenChannelResponse>
}

export interface GuildWelcomeChannel {
  readonly channel_id: SnowflakeType
  readonly description: string
  readonly emoji_id?: null | SnowflakeType
  readonly emoji_name?: string | null
}

export interface WelcomeScreenPatchRequestPartial {
  readonly description?: string | null
  readonly welcome_channels?: ReadonlyArray<GuildWelcomeChannel> | null
  readonly enabled?: boolean | null
}

export interface WidgetSettingsResponse {
  readonly enabled: boolean
  readonly channel_id?: null | SnowflakeType
}

export interface UpdateGuildWidgetSettingsRequest {
  readonly channel_id?: null | SnowflakeType
  readonly enabled?: boolean | null
}

export interface WidgetChannel {
  readonly id: SnowflakeType
  readonly name: string
  readonly position: number
}

export type WidgetUserDiscriminator = "0000"

export interface WidgetActivity {
  readonly name: string
}

export interface WidgetMember {
  readonly id: string
  readonly username: string
  readonly discriminator: WidgetUserDiscriminator
  readonly avatar?: null
  readonly status: string
  readonly avatar_url: string
  readonly activity?: null | WidgetActivity
  readonly deaf?: boolean | null
  readonly mute?: boolean | null
  readonly self_deaf?: boolean | null
  readonly self_mute?: boolean | null
  readonly suppress?: boolean | null
  readonly channel_id?: null | SnowflakeType
}

export interface WidgetResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly instant_invite?: string | null
  readonly channels: ReadonlyArray<WidgetChannel>
  readonly members: ReadonlyArray<WidgetMember>
  readonly presence_count: number
}

export const WidgetImageStyles = {
  /** shield style widget with Discord icon and guild members online count */
  SHIELD: "shield",
  /** large image with guild icon, name and online count. "POWERED BY DISCORD" as the footer of the widget */
  BANNER1: "banner1",
  /** smaller widget style with guild icon, name and online count. Split on the right with Discord logo */
  BANNER2: "banner2",
  /** large image with guild icon, name and online count. In the footer, Discord logo on the left and "Chat Now" on the right */
  BANNER3: "banner3",
  /** large Discord logo at the top of the widget. Guild icon, name and online count in the middle portion of the widget and a "JOIN MY SERVER" button at the bottom */
  BANNER4: "banner4",
} as const
export type WidgetImageStyles =
  (typeof WidgetImageStyles)[keyof typeof WidgetImageStyles]

export interface GetGuildWidgetPngParams {
  readonly style?: WidgetImageStyles
}

export interface CreateInteractionResponseParams {
  readonly with_response?: boolean
}

export const InteractionCallbackTypes = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
  DEFERRED_UPDATE_MESSAGE: 6,
  UPDATE_MESSAGE: 7,
  APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: 8,
  MODAL: 9,
  LAUNCH_ACTIVITY: 12,
} as const
export type InteractionCallbackTypes =
  (typeof InteractionCallbackTypes)[keyof typeof InteractionCallbackTypes]

export interface InteractionApplicationCommandAutocompleteCallbackIntegerData {
  readonly choices?: ReadonlyArray<null | ApplicationCommandOptionIntegerChoice> | null
}

export interface InteractionApplicationCommandAutocompleteCallbackNumberData {
  readonly choices?: ReadonlyArray<null | ApplicationCommandOptionNumberChoice> | null
}

export interface InteractionApplicationCommandAutocompleteCallbackStringData {
  readonly choices?: ReadonlyArray<null | ApplicationCommandOptionStringChoice> | null
}

export interface ApplicationCommandAutocompleteCallbackRequest {
  readonly type: 8
  readonly data:
    | InteractionApplicationCommandAutocompleteCallbackIntegerData
    | InteractionApplicationCommandAutocompleteCallbackNumberData
    | InteractionApplicationCommandAutocompleteCallbackStringData
}

export interface IncomingWebhookInteractionRequest {
  readonly content?: string | null
  readonly embeds?: ReadonlyArray<RichEmbed> | null
  readonly allowed_mentions?: null | MessageAllowedMentionsRequest
  readonly components?: ReadonlyArray<
    | ActionRowComponentForMessageRequest
    | ContainerComponentForMessageRequest
    | FileComponentForMessageRequest
    | MediaGalleryComponentForMessageRequest
    | SectionComponentForMessageRequest
    | SeparatorComponentForMessageRequest
    | TextDisplayComponentForMessageRequest
  > | null
  readonly attachments?: ReadonlyArray<MessageAttachmentRequest> | null
  readonly poll?: null | PollCreateRequest
  readonly tts?: boolean | null
  readonly flags?: number | null
}

export interface CreateMessageInteractionCallbackRequest {
  readonly type: 4 | 5
  readonly data?: null | IncomingWebhookInteractionRequest
}

export interface LaunchActivityInteractionCallbackRequest {
  readonly type: 12
}

export interface TextInputComponentForModalRequest {
  readonly type: 4
  readonly custom_id: string
  readonly style: TextInputStyleTypes
  readonly label: string
  readonly value?: string | null
  readonly placeholder?: string | null
  readonly required?: boolean | null
  readonly min_length?: number | null
  readonly max_length?: number | null
}

export interface ActionRowComponentForModalRequest {
  readonly type: 1
  readonly components: ReadonlyArray<TextInputComponentForModalRequest>
}

export interface ModalInteractionCallbackRequestData {
  readonly custom_id: string
  readonly title: string
  readonly components: ReadonlyArray<ActionRowComponentForModalRequest>
}

export interface ModalInteractionCallbackRequest {
  readonly type: 9
  readonly data: ModalInteractionCallbackRequestData
}

export interface PongInteractionCallbackRequest {
  readonly type: 1
}

export interface IncomingWebhookUpdateForInteractionCallbackRequestPartial {
  readonly content?: string | null
  readonly embeds?: ReadonlyArray<RichEmbed> | null
  readonly allowed_mentions?: null | MessageAllowedMentionsRequest
  readonly components?: ReadonlyArray<
    | ActionRowComponentForMessageRequest
    | ContainerComponentForMessageRequest
    | FileComponentForMessageRequest
    | MediaGalleryComponentForMessageRequest
    | SectionComponentForMessageRequest
    | SeparatorComponentForMessageRequest
    | TextDisplayComponentForMessageRequest
  > | null
  readonly attachments?: ReadonlyArray<MessageAttachmentRequest> | null
  readonly flags?: number | null
}

export interface UpdateMessageInteractionCallbackRequest {
  readonly type: 6 | 7
  readonly data?: null | IncomingWebhookUpdateForInteractionCallbackRequestPartial
}

export type CreateInteractionResponseRequest =
  | ApplicationCommandAutocompleteCallbackRequest
  | CreateMessageInteractionCallbackRequest
  | LaunchActivityInteractionCallbackRequest
  | ModalInteractionCallbackRequest
  | PongInteractionCallbackRequest
  | UpdateMessageInteractionCallbackRequest

export interface InteractionResponse {
  readonly id: SnowflakeType
  readonly type: InteractionTypes
  readonly response_message_id?: null | SnowflakeType
  readonly response_message_loading?: boolean | null
  readonly response_message_ephemeral?: boolean | null
  readonly channel_id?: null | SnowflakeType
  readonly guild_id?: null | SnowflakeType
}

export interface CreateMessageInteractionCallbackResponse {
  readonly type: 4
  readonly message: MessageResponse
}

export interface LaunchActivityInteractionCallbackResponse {
  readonly type: 12
}

export interface UpdateMessageInteractionCallbackResponse {
  readonly type: 7
  readonly message: MessageResponse
}

export interface InteractionCallbackResponse {
  readonly interaction: InteractionResponse
  readonly resource?:
    | CreateMessageInteractionCallbackResponse
    | LaunchActivityInteractionCallbackResponse
    | UpdateMessageInteractionCallbackResponse
    | null
}

export interface InviteResolveParams {
  readonly with_counts?: boolean
  readonly guild_scheduled_event_id?: SnowflakeType
}

export type InviteResolve200 =
  | FriendInviteResponse
  | GroupDMInviteResponse
  | GuildInviteResponse

export type InviteRevoke200 =
  | FriendInviteResponse
  | GroupDMInviteResponse
  | GuildInviteResponse

export interface CreateOrJoinLobbyRequest {
  readonly idle_timeout_seconds?: number | null
  readonly lobby_metadata?: Record<string, unknown> | null
  readonly member_metadata?: Record<string, unknown> | null
  readonly secret: string
}

export interface LobbyMemberResponse {
  readonly id: SnowflakeType
  readonly metadata?: Record<string, unknown> | null
  readonly flags: number
}

export interface LobbyResponse {
  readonly id: SnowflakeType
  readonly application_id: SnowflakeType
  readonly metadata?: Record<string, unknown> | null
  readonly members?: ReadonlyArray<LobbyMemberResponse> | null
  readonly linked_channel?: null | GuildChannelResponse
}

export type LobbyMemberRequestFlagsEnum = 1

export interface LobbyMemberRequest {
  readonly id: SnowflakeType
  readonly metadata?: Record<string, unknown> | null
  readonly flags?: null | LobbyMemberRequestFlagsEnum
}

export interface CreateLobbyRequest {
  readonly idle_timeout_seconds?: number | null
  readonly members?: ReadonlyArray<LobbyMemberRequest> | null
  readonly metadata?: Record<string, unknown> | null
}

export interface EditLobbyRequest {
  readonly idle_timeout_seconds?: number | null
  readonly metadata?: Record<string, unknown> | null
  readonly members?: ReadonlyArray<LobbyMemberRequest> | null
}

export interface EditLobbyChannelLinkRequest {
  readonly channel_id?: null | SnowflakeType
}

export type AddLobbyMemberRequestFlagsEnum = 1

export interface AddLobbyMemberRequest {
  readonly metadata?: Record<string, unknown> | null
  readonly flags?: null | AddLobbyMemberRequestFlagsEnum
}

export interface SDKMessageRequest {
  readonly content?: string | null
  readonly embeds?: ReadonlyArray<RichEmbed> | null
  readonly allowed_mentions?: null | MessageAllowedMentionsRequest
  readonly sticker_ids?: ReadonlyArray<SnowflakeType> | null
  readonly components?: ReadonlyArray<
    | ActionRowComponentForMessageRequest
    | ContainerComponentForMessageRequest
    | FileComponentForMessageRequest
    | MediaGalleryComponentForMessageRequest
    | SectionComponentForMessageRequest
    | SeparatorComponentForMessageRequest
    | TextDisplayComponentForMessageRequest
  > | null
  readonly flags?: number | null
  readonly attachments?: ReadonlyArray<MessageAttachmentRequest> | null
  readonly poll?: null | PollCreateRequest
  readonly confetti_potion?: null | ConfettiPotionCreateRequest
  readonly message_reference?: null | MessageReferenceRequest
  readonly nonce?: number | string | null
  readonly enforce_nonce?: boolean | null
  readonly tts?: boolean | null
}

export interface LobbyMessageResponse {
  readonly id: SnowflakeType
  readonly type: MessageType
  readonly content: string
  readonly lobby_id: SnowflakeType
  readonly channel_id: SnowflakeType
  readonly author: UserResponse
  readonly metadata?: Record<string, unknown> | null
  readonly flags: number
  readonly application_id?: null | SnowflakeType
}

export interface OAuth2GetAuthorizationResponse {
  readonly application: ApplicationResponse
  readonly expires: string
  readonly scopes: ReadonlyArray<OAuth2Scopes>
  readonly user?: null | UserResponse
}

export interface OAuth2Key {
  readonly kty: string
  readonly use: string
  readonly kid: string
  readonly n: string
  readonly e: string
  readonly alg: string
}

export interface OAuth2GetKeys {
  readonly keys: ReadonlyArray<OAuth2Key>
}

export interface OAuth2GetOpenIDConnectUserInfoResponse {
  readonly sub: string
  readonly email?: string | null
  readonly email_verified?: boolean | null
  readonly preferred_username?: string | null
  readonly nickname?: string | null
  readonly picture?: string | null
  readonly locale?: string | null
}

export const ApplicationIdentityProviderAuthType = {
  OIDC: "OIDC",
  EPIC_ONLINE_SERVICES_ACCESS_TOKEN: "EPIC_ONLINE_SERVICES_ACCESS_TOKEN",
  EPIC_ONLINE_SERVICES_ID_TOKEN: "EPIC_ONLINE_SERVICES_ID_TOKEN",
  STEAM_SESSION_TICKET: "STEAM_SESSION_TICKET",
  UNITY_SERVICES_ID_TOKEN: "UNITY_SERVICES_ID_TOKEN",
} as const
export type ApplicationIdentityProviderAuthType =
  (typeof ApplicationIdentityProviderAuthType)[keyof typeof ApplicationIdentityProviderAuthType]

export interface PartnerSdkUnmergeProvisionalAccountRequest {
  readonly client_id: SnowflakeType
  readonly client_secret?: string | null
  readonly external_auth_token: string
  readonly external_auth_type: ApplicationIdentityProviderAuthType
}

export interface PartnerSdkTokenRequest {
  readonly client_id: SnowflakeType
  readonly client_secret?: string | null
  readonly external_auth_token: string
  readonly external_auth_type: ApplicationIdentityProviderAuthType
}

export interface ProvisionalTokenResponse {
  readonly token_type: string
  readonly access_token: string
  readonly expires_in: number
  readonly scope: string
  readonly id_token: string
  readonly refresh_token?: string | null
  readonly scopes?: ReadonlyArray<string> | null
  readonly expires_at_s?: number | null
}

export type GetSoundboardDefaultSounds200 =
  ReadonlyArray<SoundboardSoundResponse>

export const StageInstancesPrivacyLevels = {
  /** The Stage instance is visible publicly. (deprecated) */
  PUBLIC: 1,
  /** The Stage instance is visible publicly. (deprecated) */
  GUILD_ONLY: 2,
} as const
export type StageInstancesPrivacyLevels =
  (typeof StageInstancesPrivacyLevels)[keyof typeof StageInstancesPrivacyLevels]

export interface CreateStageInstanceRequest {
  readonly topic: string
  readonly channel_id: SnowflakeType
  readonly privacy_level?: null | StageInstancesPrivacyLevels
  readonly guild_scheduled_event_id?: null | SnowflakeType
  readonly send_start_notification?: boolean | null
}

export interface StageInstanceResponse {
  readonly guild_id: SnowflakeType
  readonly channel_id: SnowflakeType
  readonly topic: string
  readonly privacy_level: StageInstancesPrivacyLevels
  readonly id: SnowflakeType
  readonly discoverable_disabled?: boolean | null
  readonly guild_scheduled_event_id?: null | SnowflakeType
}

export interface UpdateStageInstanceRequest {
  readonly topic?: string
  readonly privacy_level?: StageInstancesPrivacyLevels
}

export interface StickerPackResponse {
  readonly id: SnowflakeType
  readonly sku_id: SnowflakeType
  readonly name: string
  readonly description?: string | null
  readonly stickers: ReadonlyArray<StandardStickerResponse>
  readonly cover_sticker_id?: null | SnowflakeType
  readonly banner_asset_id?: null | SnowflakeType
}

export interface StickerPackCollectionResponse {
  readonly sticker_packs: ReadonlyArray<StickerPackResponse>
}

export type GetSticker200 = GuildStickerResponse | StandardStickerResponse

export const PremiumTypes = {
  /** None */
  NONE: 0,
  /** Nitro Classic */
  TIER_1: 1,
  /** Nitro Standard */
  TIER_2: 2,
  /** Nitro Basic */
  TIER_0: 3,
} as const
export type PremiumTypes = (typeof PremiumTypes)[keyof typeof PremiumTypes]

export interface UserPIIResponse {
  readonly id: SnowflakeType
  readonly username: string
  readonly avatar?: string | null
  readonly discriminator: string
  readonly public_flags: number
  readonly flags: Int53Type
  readonly bot?: boolean | null
  readonly system?: boolean | null
  readonly banner?: string | null
  readonly accent_color?: number | null
  readonly global_name?: string | null
  readonly avatar_decoration_data?: null | UserAvatarDecorationResponse
  readonly collectibles?: null | UserCollectiblesResponse
  readonly clan?: null | UserPrimaryGuildResponse
  readonly mfa_enabled: boolean
  readonly locale: AvailableLocalesEnum
  readonly premium_type?: null | PremiumTypes
  readonly email?: string | null
  readonly verified?: boolean | null
}

export interface BotAccountPatchRequest {
  readonly username: string
  readonly avatar?: string | null
  readonly banner?: string | null
}

export interface ApplicationUserRoleConnectionResponse {
  readonly platform_name?: string | null
  readonly platform_username?: string | null
  readonly metadata?: Record<string, unknown> | null
}

export interface UpdateApplicationUserRoleConnectionRequest {
  readonly platform_name?: string | null
  readonly platform_username?: string | null
  readonly metadata?: Record<string, unknown> | null
}

export interface CreatePrivateChannelRequest {
  readonly recipient_id?: null | SnowflakeType
  readonly access_tokens?: ReadonlyArray<string> | null
  readonly nicks?: Record<string, unknown> | null
}

export type CreateDm200 = PrivateChannelResponse | PrivateGroupChannelResponse

export const ConnectedAccountProviders = {
  BATTLENET: "battlenet",
  BLUESKY: "bluesky",
  BUNGIE: "bungie",
  EBAY: "ebay",
  EPIC_GAMES: "epicgames",
  FACEBOOK: "facebook",
  GITHUB: "github",
  INSTAGRAM: "instagram",
  MASTODON: "mastodon",
  LEAGUE_OF_LEGENDS: "leagueoflegends",
  PAYPAL: "paypal",
  PLAYSTATION: "playstation",
  REDDIT: "reddit",
  RIOT_GAMES: "riotgames",
  ROBLOX: "roblox",
  SKYPE: "skype",
  SPOTIFY: "spotify",
  STEAM: "steam",
  TIKTOK: "tiktok",
  TWITCH: "twitch",
  TWITTER: "twitter",
  XBOX: "xbox",
  YOUTUBE: "youtube",
  DOMAIN: "domain",
} as const
export type ConnectedAccountProviders =
  (typeof ConnectedAccountProviders)[keyof typeof ConnectedAccountProviders]

export interface ConnectedAccountGuildResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly icon?: string | null
}

export interface ConnectedAccountIntegrationResponse {
  readonly id: string
  readonly type: IntegrationTypes
  readonly account: AccountResponse
  readonly guild: ConnectedAccountGuildResponse
}

export const ConnectedAccountVisibility = {
  NONE: 0,
  EVERYONE: 1,
} as const
export type ConnectedAccountVisibility =
  (typeof ConnectedAccountVisibility)[keyof typeof ConnectedAccountVisibility]

export interface ConnectedAccountResponse {
  readonly id: string
  readonly name?: string | null
  readonly type: ConnectedAccountProviders
  readonly friend_sync: boolean
  readonly integrations?: ReadonlyArray<ConnectedAccountIntegrationResponse> | null
  readonly show_activity: boolean
  readonly two_way_link: boolean
  readonly verified: boolean
  readonly visibility: ConnectedAccountVisibility
  readonly revoked?: boolean | null
}

export type ListMyConnections200 = ReadonlyArray<ConnectedAccountResponse>

export interface ListMyGuildsParams {
  readonly before?: SnowflakeType
  readonly after?: SnowflakeType
  readonly limit?: number
  readonly with_counts?: boolean
}

export interface MyGuildResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly icon?: string | null
  readonly banner?: string | null
  readonly owner: boolean
  readonly permissions: string
  readonly features: ReadonlyArray<GuildFeatures>
  readonly approximate_member_count?: number | null
  readonly approximate_presence_count?: number | null
}

export type ListMyGuilds200 = ReadonlyArray<MyGuildResponse>

export type ListVoiceRegions200 = ReadonlyArray<VoiceRegionResponse>

export type GetWebhook200 =
  | ApplicationIncomingWebhookResponse
  | ChannelFollowerWebhookResponse
  | GuildIncomingWebhookResponse

export interface UpdateWebhookRequest {
  readonly name?: string
  readonly avatar?: string | null
  readonly channel_id?: null | SnowflakeType
}

export type UpdateWebhook200 =
  | ApplicationIncomingWebhookResponse
  | ChannelFollowerWebhookResponse
  | GuildIncomingWebhookResponse

export type GetWebhookByToken200 =
  | ApplicationIncomingWebhookResponse
  | ChannelFollowerWebhookResponse
  | GuildIncomingWebhookResponse

export interface ExecuteWebhookParams {
  readonly wait?: boolean
  readonly thread_id?: SnowflakeType
  readonly with_components?: boolean
}

export interface IncomingWebhookRequestPartial {
  readonly content?: string | null
  readonly embeds?: ReadonlyArray<RichEmbed> | null
  readonly allowed_mentions?: null | MessageAllowedMentionsRequest
  readonly components?: ReadonlyArray<
    | ActionRowComponentForMessageRequest
    | ContainerComponentForMessageRequest
    | FileComponentForMessageRequest
    | MediaGalleryComponentForMessageRequest
    | SectionComponentForMessageRequest
    | SeparatorComponentForMessageRequest
    | TextDisplayComponentForMessageRequest
  > | null
  readonly attachments?: ReadonlyArray<MessageAttachmentRequest> | null
  readonly poll?: null | PollCreateRequest
  readonly tts?: boolean | null
  readonly flags?: number | null
  readonly username?: string | null
  readonly avatar_url?: string | null
  readonly thread_name?: string | null
  readonly applied_tags?: ReadonlyArray<SnowflakeType> | null
}

export interface IncomingWebhookUpdateRequestPartial {
  readonly content?: string | null
  readonly embeds?: ReadonlyArray<RichEmbed> | null
  readonly allowed_mentions?: null | MessageAllowedMentionsRequest
  readonly components?: ReadonlyArray<
    | ActionRowComponentForMessageRequest
    | ContainerComponentForMessageRequest
    | FileComponentForMessageRequest
    | MediaGalleryComponentForMessageRequest
    | SectionComponentForMessageRequest
    | SeparatorComponentForMessageRequest
    | TextDisplayComponentForMessageRequest
  > | null
  readonly attachments?: ReadonlyArray<MessageAttachmentRequest> | null
  readonly poll?: null | PollCreateRequest
  readonly flags?: number | null
}

export type ExecuteWebhookRequest =
  | IncomingWebhookRequestPartial
  | IncomingWebhookUpdateRequestPartial

export interface UpdateWebhookByTokenRequest {
  readonly name?: string
  readonly avatar?: string | null
}

export type UpdateWebhookByToken200 =
  | ApplicationIncomingWebhookResponse
  | ChannelFollowerWebhookResponse
  | GuildIncomingWebhookResponse

export interface ExecuteGithubCompatibleWebhookParams {
  readonly wait?: boolean
  readonly thread_id?: SnowflakeType
}

export interface GithubUser {
  readonly id: number
  readonly login: string
  readonly html_url: string
  readonly avatar_url: string
}

export interface GithubComment {
  readonly id: number
  readonly html_url: string
  readonly user: GithubUser
  readonly commit_id?: string | null
  readonly body: string
}

export interface GithubIssue {
  readonly id: number
  readonly number: number
  readonly html_url: string
  readonly user: GithubUser
  readonly title: string
  readonly body?: string | null
}

export interface GithubRepository {
  readonly id: number
  readonly html_url: string
  readonly name: string
  readonly full_name: string
}

export interface GithubRelease {
  readonly id: number
  readonly tag_name: string
  readonly html_url: string
  readonly author: GithubUser
}

export interface GithubAuthor {
  readonly username?: string | null
  readonly name: string
}

export interface GithubCommit {
  readonly id: string
  readonly url: string
  readonly message: string
  readonly author: GithubAuthor
}

export interface GithubReview {
  readonly user: GithubUser
  readonly body?: string | null
  readonly html_url: string
  readonly state: string
}

export interface GithubCheckPullRequest {
  readonly number: number
}

export interface GithubCheckApp {
  readonly name: string
}

export interface GithubCheckSuite {
  readonly conclusion?: string | null
  readonly head_branch?: string | null
  readonly head_sha: string
  readonly pull_requests?: ReadonlyArray<GithubCheckPullRequest> | null
  readonly app: GithubCheckApp
}

export interface GithubCheckRunOutput {
  readonly title?: string | null
  readonly summary?: string | null
}

export interface GithubCheckRun {
  readonly conclusion?: string | null
  readonly name: string
  readonly html_url: string
  readonly check_suite: GithubCheckSuite
  readonly details_url?: string | null
  readonly output?: null | GithubCheckRunOutput
  readonly pull_requests?: ReadonlyArray<GithubCheckPullRequest> | null
}

export interface GithubDiscussion {
  readonly title: string
  readonly number: number
  readonly html_url: string
  readonly answer_html_url?: string | null
  readonly body?: string | null
  readonly user: GithubUser
}

export interface GithubWebhook {
  readonly action?: string | null
  readonly ref?: string | null
  readonly ref_type?: string | null
  readonly comment?: null | GithubComment
  readonly issue?: null | GithubIssue
  readonly pull_request?: null | GithubIssue
  readonly repository?: null | GithubRepository
  readonly forkee?: null | GithubRepository
  readonly sender: GithubUser
  readonly member?: null | GithubUser
  readonly release?: null | GithubRelease
  readonly head_commit?: null | GithubCommit
  readonly commits?: ReadonlyArray<GithubCommit> | null
  readonly forced?: boolean | null
  readonly compare?: string | null
  readonly review?: null | GithubReview
  readonly check_run?: null | GithubCheckRun
  readonly check_suite?: null | GithubCheckSuite
  readonly discussion?: null | GithubDiscussion
  readonly answer?: null | GithubComment
}

export interface GetOriginalWebhookMessageParams {
  readonly thread_id?: SnowflakeType
}

export interface DeleteOriginalWebhookMessageParams {
  readonly thread_id?: SnowflakeType
}

export interface UpdateOriginalWebhookMessageParams {
  readonly thread_id?: SnowflakeType
  readonly with_components?: boolean
}

export interface GetWebhookMessageParams {
  readonly thread_id?: SnowflakeType
}

export interface DeleteWebhookMessageParams {
  readonly thread_id?: SnowflakeType
}

export interface UpdateWebhookMessageParams {
  readonly thread_id?: SnowflakeType
  readonly with_components?: boolean
}

export interface ExecuteSlackCompatibleWebhookParams {
  readonly wait?: boolean
  readonly thread_id?: SnowflakeType
}

export interface WebhookSlackEmbedField {
  readonly name?: string | null
  readonly value?: string | null
  readonly inline?: boolean | null
}

export interface WebhookSlackEmbed {
  readonly title?: string | null
  readonly title_link?: string | null
  readonly text?: string | null
  readonly color?: string | null
  readonly ts?: number | null
  readonly pretext?: string | null
  readonly footer?: string | null
  readonly footer_icon?: string | null
  readonly author_name?: string | null
  readonly author_link?: string | null
  readonly author_icon?: string | null
  readonly image_url?: string | null
  readonly thumb_url?: string | null
  readonly fields?: ReadonlyArray<WebhookSlackEmbedField> | null
}

export interface SlackWebhook {
  readonly text?: string | null
  readonly username?: string | null
  readonly icon_url?: string | null
  readonly attachments?: ReadonlyArray<WebhookSlackEmbed> | null
}

export type ExecuteSlackCompatibleWebhook200 = string

export const make = (
  httpClient: HttpClient.HttpClient,
  options: {
    readonly transformClient?:
      | ((
          client: HttpClient.HttpClient,
        ) => Effect.Effect<HttpClient.HttpClient>)
      | undefined
  } = {},
): DiscordRest => {
  const unexpectedStatus = (response: HttpClientResponse.HttpClientResponse) =>
    Effect.flatMap(
      Effect.orElseSucceed(response.text, () => "Unexpected status code"),
      description =>
        Effect.fail(
          new HttpClientError.ResponseError({
            request: response.request,
            response,
            reason: "StatusCode",
            description,
          }),
        ),
    )
  const applyClientTransform = (
    client: HttpClient.HttpClient,
  ): Effect.Effect<HttpClient.HttpClient> =>
    options.transformClient
      ? options.transformClient(client)
      : Effect.succeed(client)
  const decodeSuccess = <A>(response: HttpClientResponse.HttpClientResponse) =>
    response.json as Effect.Effect<A, HttpClientError.ResponseError>
  const decodeVoid = (_response: HttpClientResponse.HttpClientResponse) =>
    Effect.void
  const decodeError =
    <Tag extends string, E>(tag: Tag) =>
    (
      response: HttpClientResponse.HttpClientResponse,
    ): Effect.Effect<
      never,
      DiscordRestError<Tag, E> | HttpClientError.ResponseError
    > =>
      Effect.flatMap(
        response.json as Effect.Effect<E, HttpClientError.ResponseError>,
        cause => Effect.fail(DiscordRestError(tag, cause)),
      )
  const onRequest = (
    successCodes: ReadonlyArray<string>,
    errorCodes: Record<string, string>,
  ) => {
    const cases: any = { orElse: unexpectedStatus }
    for (const code of successCodes) {
      cases[code] = decodeSuccess
    }
    for (const [code, tag] of Object.entries(errorCodes)) {
      cases[code] = decodeError(tag)
    }
    if (successCodes.length === 0) {
      cases["2xx"] = decodeVoid
    }
    return (
      request: HttpClientRequest.HttpClientRequest,
    ): Effect.Effect<any, any> =>
      Effect.flatMap(applyClientTransform(httpClient), httpClient =>
        Effect.flatMap(
          httpClient.execute(request),
          HttpClientResponse.matchStatus(cases) as any,
        ),
      )
  }
  return {
    httpClient,
    getMyApplication: () =>
      HttpClientRequest.make("GET")(`/applications/@me`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    updateMyApplication: options =>
      HttpClientRequest.make("PATCH")(`/applications/@me`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getApplication: applicationId =>
      HttpClientRequest.make("GET")(`/applications/${applicationId}`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    updateApplication: (applicationId, options) =>
      HttpClientRequest.make("PATCH")(`/applications/${applicationId}`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    applicationsGetActivityInstance: (applicationId, instanceId) =>
      HttpClientRequest.make("GET")(
        `/applications/${applicationId}/activity-instances/${instanceId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    uploadApplicationAttachment: (applicationId, options) =>
      HttpClientRequest.make("POST")(
        `/applications/${applicationId}/attachment`,
      ).pipe(
        HttpClientRequest.bodyFormData(options),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listApplicationCommands: (applicationId, options) =>
      HttpClientRequest.make("GET")(
        `/applications/${applicationId}/commands`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          with_localizations: options[
            "with_localizations"
          ] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    bulkSetApplicationCommands: (applicationId, options) =>
      HttpClientRequest.make("PUT")(
        `/applications/${applicationId}/commands`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    createApplicationCommand: (applicationId, options) =>
      HttpClientRequest.make("POST")(
        `/applications/${applicationId}/commands`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["200", "201"], {})),
      ),
    getApplicationCommand: (applicationId, commandId) =>
      HttpClientRequest.make("GET")(
        `/applications/${applicationId}/commands/${commandId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    deleteApplicationCommand: (applicationId, commandId) =>
      HttpClientRequest.make("DELETE")(
        `/applications/${applicationId}/commands/${commandId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    updateApplicationCommand: (applicationId, commandId, options) =>
      HttpClientRequest.make("PATCH")(
        `/applications/${applicationId}/commands/${commandId}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listApplicationEmojis: applicationId =>
      HttpClientRequest.make("GET")(
        `/applications/${applicationId}/emojis`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    createApplicationEmoji: (applicationId, options) =>
      HttpClientRequest.make("POST")(
        `/applications/${applicationId}/emojis`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getApplicationEmoji: (applicationId, emojiId) =>
      HttpClientRequest.make("GET")(
        `/applications/${applicationId}/emojis/${emojiId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    deleteApplicationEmoji: (applicationId, emojiId) =>
      HttpClientRequest.make("DELETE")(
        `/applications/${applicationId}/emojis/${emojiId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    updateApplicationEmoji: (applicationId, emojiId, options) =>
      HttpClientRequest.make("PATCH")(
        `/applications/${applicationId}/emojis/${emojiId}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getEntitlements: (applicationId, options) =>
      HttpClientRequest.make("GET")(
        `/applications/${applicationId}/entitlements`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          user_id: options["user_id"] as UrlParams.Coercible,
          sku_ids: options["sku_ids"] as UrlParams.Coercible,
          guild_id: options["guild_id"] as UrlParams.Coercible,
          before: options["before"] as UrlParams.Coercible,
          after: options["after"] as UrlParams.Coercible,
          limit: options["limit"] as UrlParams.Coercible,
          exclude_ended: options["exclude_ended"] as UrlParams.Coercible,
          exclude_deleted: options["exclude_deleted"] as UrlParams.Coercible,
          only_active: options["only_active"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    createEntitlement: (applicationId, options) =>
      HttpClientRequest.make("POST")(
        `/applications/${applicationId}/entitlements`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getEntitlement: (applicationId, entitlementId) =>
      HttpClientRequest.make("GET")(
        `/applications/${applicationId}/entitlements/${entitlementId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    deleteEntitlement: (applicationId, entitlementId) =>
      HttpClientRequest.make("DELETE")(
        `/applications/${applicationId}/entitlements/${entitlementId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    consumeEntitlement: (applicationId, entitlementId) =>
      HttpClientRequest.make("POST")(
        `/applications/${applicationId}/entitlements/${entitlementId}/consume`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    listGuildApplicationCommands: (applicationId, guildId, options) =>
      HttpClientRequest.make("GET")(
        `/applications/${applicationId}/guilds/${guildId}/commands`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          with_localizations: options[
            "with_localizations"
          ] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    bulkSetGuildApplicationCommands: (applicationId, guildId, options) =>
      HttpClientRequest.make("PUT")(
        `/applications/${applicationId}/guilds/${guildId}/commands`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    createGuildApplicationCommand: (applicationId, guildId, options) =>
      HttpClientRequest.make("POST")(
        `/applications/${applicationId}/guilds/${guildId}/commands`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["200", "201"], {})),
      ),
    listGuildApplicationCommandPermissions: (applicationId, guildId) =>
      HttpClientRequest.make("GET")(
        `/applications/${applicationId}/guilds/${guildId}/commands/permissions`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    getGuildApplicationCommand: (applicationId, guildId, commandId) =>
      HttpClientRequest.make("GET")(
        `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    deleteGuildApplicationCommand: (applicationId, guildId, commandId) =>
      HttpClientRequest.make("DELETE")(
        `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    updateGuildApplicationCommand: (
      applicationId,
      guildId,
      commandId,
      options,
    ) =>
      HttpClientRequest.make("PATCH")(
        `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGuildApplicationCommandPermissions: (
      applicationId,
      guildId,
      commandId,
    ) =>
      HttpClientRequest.make("GET")(
        `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    setGuildApplicationCommandPermissions: (
      applicationId,
      guildId,
      commandId,
      options,
    ) =>
      HttpClientRequest.make("PUT")(
        `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getApplicationRoleConnectionsMetadata: applicationId =>
      HttpClientRequest.make("GET")(
        `/applications/${applicationId}/role-connections/metadata`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    updateApplicationRoleConnectionsMetadata: (applicationId, options) =>
      HttpClientRequest.make("PUT")(
        `/applications/${applicationId}/role-connections/metadata`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getChannel: channelId =>
      HttpClientRequest.make("GET")(`/channels/${channelId}`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    deleteChannel: channelId =>
      HttpClientRequest.make("DELETE")(`/channels/${channelId}`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    updateChannel: (channelId, options) =>
      HttpClientRequest.make("PATCH")(`/channels/${channelId}`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    followChannel: (channelId, options) =>
      HttpClientRequest.make("POST")(`/channels/${channelId}/followers`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listChannelInvites: channelId =>
      HttpClientRequest.make("GET")(`/channels/${channelId}/invites`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    createChannelInvite: (channelId, options) =>
      HttpClientRequest.make("POST")(`/channels/${channelId}/invites`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listMessages: (channelId, options) =>
      HttpClientRequest.make("GET")(`/channels/${channelId}/messages`).pipe(
        HttpClientRequest.setUrlParams({
          around: options["around"] as UrlParams.Coercible,
          before: options["before"] as UrlParams.Coercible,
          after: options["after"] as UrlParams.Coercible,
          limit: options["limit"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    createMessage: (channelId, options) =>
      HttpClientRequest.make("POST")(`/channels/${channelId}/messages`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    bulkDeleteMessages: (channelId, options) =>
      HttpClientRequest.make("POST")(
        `/channels/${channelId}/messages/bulk-delete`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest([], {})),
      ),
    getMessage: (channelId, messageId) =>
      HttpClientRequest.make("GET")(
        `/channels/${channelId}/messages/${messageId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    deleteMessage: (channelId, messageId) =>
      HttpClientRequest.make("DELETE")(
        `/channels/${channelId}/messages/${messageId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    updateMessage: (channelId, messageId, options) =>
      HttpClientRequest.make("PATCH")(
        `/channels/${channelId}/messages/${messageId}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    crosspostMessage: (channelId, messageId) =>
      HttpClientRequest.make("POST")(
        `/channels/${channelId}/messages/${messageId}/crosspost`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    deleteAllMessageReactions: (channelId, messageId) =>
      HttpClientRequest.make("DELETE")(
        `/channels/${channelId}/messages/${messageId}/reactions`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    listMessageReactionsByEmoji: (channelId, messageId, emojiName, options) =>
      HttpClientRequest.make("GET")(
        `/channels/${channelId}/messages/${messageId}/reactions/${emojiName}`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          after: options["after"] as UrlParams.Coercible,
          limit: options["limit"] as UrlParams.Coercible,
          type: options["type"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    deleteAllMessageReactionsByEmoji: (channelId, messageId, emojiName) =>
      HttpClientRequest.make("DELETE")(
        `/channels/${channelId}/messages/${messageId}/reactions/${emojiName}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    addMyMessageReaction: (channelId, messageId, emojiName) =>
      HttpClientRequest.make("PUT")(
        `/channels/${channelId}/messages/${messageId}/reactions/${emojiName}/@me`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    deleteMyMessageReaction: (channelId, messageId, emojiName) =>
      HttpClientRequest.make("DELETE")(
        `/channels/${channelId}/messages/${messageId}/reactions/${emojiName}/@me`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    deleteUserMessageReaction: (channelId, messageId, emojiName, userId) =>
      HttpClientRequest.make("DELETE")(
        `/channels/${channelId}/messages/${messageId}/reactions/${emojiName}/${userId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    createThreadFromMessage: (channelId, messageId, options) =>
      HttpClientRequest.make("POST")(
        `/channels/${channelId}/messages/${messageId}/threads`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    setChannelPermissionOverwrite: (channelId, overwriteId, options) =>
      HttpClientRequest.make("PUT")(
        `/channels/${channelId}/permissions/${overwriteId}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest([], {})),
      ),
    deleteChannelPermissionOverwrite: (channelId, overwriteId) =>
      HttpClientRequest.make("DELETE")(
        `/channels/${channelId}/permissions/${overwriteId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    listPinnedMessages: channelId =>
      HttpClientRequest.make("GET")(`/channels/${channelId}/pins`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    pinMessage: (channelId, messageId) =>
      HttpClientRequest.make("PUT")(
        `/channels/${channelId}/pins/${messageId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    unpinMessage: (channelId, messageId) =>
      HttpClientRequest.make("DELETE")(
        `/channels/${channelId}/pins/${messageId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    getAnswerVoters: (channelId, messageId, answerId, options) =>
      HttpClientRequest.make("GET")(
        `/channels/${channelId}/polls/${messageId}/answers/${answerId}`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          after: options["after"] as UrlParams.Coercible,
          limit: options["limit"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    pollExpire: (channelId, messageId) =>
      HttpClientRequest.make("POST")(
        `/channels/${channelId}/polls/${messageId}/expire`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    addGroupDmUser: (channelId, userId, options) =>
      HttpClientRequest.make("PUT")(
        `/channels/${channelId}/recipients/${userId}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    deleteGroupDmUser: (channelId, userId) =>
      HttpClientRequest.make("DELETE")(
        `/channels/${channelId}/recipients/${userId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    sendSoundboardSound: (channelId, options) =>
      HttpClientRequest.make("POST")(
        `/channels/${channelId}/send-soundboard-sound`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest([], {})),
      ),
    listThreadMembers: (channelId, options) =>
      HttpClientRequest.make("GET")(
        `/channels/${channelId}/thread-members`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          with_member: options["with_member"] as UrlParams.Coercible,
          limit: options["limit"] as UrlParams.Coercible,
          after: options["after"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    joinThread: channelId =>
      HttpClientRequest.make("PUT")(
        `/channels/${channelId}/thread-members/@me`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    leaveThread: channelId =>
      HttpClientRequest.make("DELETE")(
        `/channels/${channelId}/thread-members/@me`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    getThreadMember: (channelId, userId, options) =>
      HttpClientRequest.make("GET")(
        `/channels/${channelId}/thread-members/${userId}`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          with_member: options["with_member"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    addThreadMember: (channelId, userId) =>
      HttpClientRequest.make("PUT")(
        `/channels/${channelId}/thread-members/${userId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    deleteThreadMember: (channelId, userId) =>
      HttpClientRequest.make("DELETE")(
        `/channels/${channelId}/thread-members/${userId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    createThread: (channelId, options) =>
      HttpClientRequest.make("POST")(`/channels/${channelId}/threads`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listPrivateArchivedThreads: (channelId, options) =>
      HttpClientRequest.make("GET")(
        `/channels/${channelId}/threads/archived/private`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          before: options["before"] as UrlParams.Coercible,
          limit: options["limit"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listPublicArchivedThreads: (channelId, options) =>
      HttpClientRequest.make("GET")(
        `/channels/${channelId}/threads/archived/public`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          before: options["before"] as UrlParams.Coercible,
          limit: options["limit"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    threadSearch: (channelId, options) =>
      HttpClientRequest.make("GET")(
        `/channels/${channelId}/threads/search`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          name: options["name"] as UrlParams.Coercible,
          slop: options["slop"] as UrlParams.Coercible,
          min_id: options["min_id"] as UrlParams.Coercible,
          max_id: options["max_id"] as UrlParams.Coercible,
          tag: options["tag"] as UrlParams.Coercible,
          tag_setting: options["tag_setting"] as UrlParams.Coercible,
          archived: options["archived"] as UrlParams.Coercible,
          sort_by: options["sort_by"] as UrlParams.Coercible,
          sort_order: options["sort_order"] as UrlParams.Coercible,
          limit: options["limit"] as UrlParams.Coercible,
          offset: options["offset"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    triggerTypingIndicator: channelId =>
      HttpClientRequest.make("POST")(`/channels/${channelId}/typing`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listMyPrivateArchivedThreads: (channelId, options) =>
      HttpClientRequest.make("GET")(
        `/channels/${channelId}/users/@me/threads/archived/private`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          before: options["before"] as UrlParams.Coercible,
          limit: options["limit"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listChannelWebhooks: channelId =>
      HttpClientRequest.make("GET")(`/channels/${channelId}/webhooks`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    createWebhook: (channelId, options) =>
      HttpClientRequest.make("POST")(`/channels/${channelId}/webhooks`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGateway: () =>
      HttpClientRequest.make("GET")(`/gateway`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getBotGateway: () =>
      HttpClientRequest.make("GET")(`/gateway/bot`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    createGuild: options =>
      HttpClientRequest.make("POST")(`/guilds`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGuildTemplate: code =>
      HttpClientRequest.make("GET")(`/guilds/templates/${code}`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    createGuildFromTemplate: (code, options) =>
      HttpClientRequest.make("POST")(`/guilds/templates/${code}`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGuild: (guildId, options) =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}`).pipe(
        HttpClientRequest.setUrlParams({
          with_counts: options["with_counts"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    deleteGuild: guildId =>
      HttpClientRequest.make("DELETE")(`/guilds/${guildId}`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest([], {})),
      ),
    updateGuild: (guildId, options) =>
      HttpClientRequest.make("PATCH")(`/guilds/${guildId}`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listGuildAuditLogEntries: (guildId, options) =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/audit-logs`).pipe(
        HttpClientRequest.setUrlParams({
          user_id: options["user_id"] as UrlParams.Coercible,
          target_id: options["target_id"] as UrlParams.Coercible,
          action_type: options["action_type"] as UrlParams.Coercible,
          before: options["before"] as UrlParams.Coercible,
          after: options["after"] as UrlParams.Coercible,
          limit: options["limit"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listAutoModerationRules: guildId =>
      HttpClientRequest.make("GET")(
        `/guilds/${guildId}/auto-moderation/rules`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    createAutoModerationRule: (guildId, options) =>
      HttpClientRequest.make("POST")(
        `/guilds/${guildId}/auto-moderation/rules`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getAutoModerationRule: (guildId, ruleId) =>
      HttpClientRequest.make("GET")(
        `/guilds/${guildId}/auto-moderation/rules/${ruleId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    deleteAutoModerationRule: (guildId, ruleId) =>
      HttpClientRequest.make("DELETE")(
        `/guilds/${guildId}/auto-moderation/rules/${ruleId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    updateAutoModerationRule: (guildId, ruleId, options) =>
      HttpClientRequest.make("PATCH")(
        `/guilds/${guildId}/auto-moderation/rules/${ruleId}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listGuildBans: (guildId, options) =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/bans`).pipe(
        HttpClientRequest.setUrlParams({
          limit: options["limit"] as UrlParams.Coercible,
          before: options["before"] as UrlParams.Coercible,
          after: options["after"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGuildBan: (guildId, userId) =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/bans/${userId}`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    banUserFromGuild: (guildId, userId, options) =>
      HttpClientRequest.make("PUT")(`/guilds/${guildId}/bans/${userId}`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest([], {})),
      ),
    unbanUserFromGuild: (guildId, userId) =>
      HttpClientRequest.make("DELETE")(
        `/guilds/${guildId}/bans/${userId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    bulkBanUsersFromGuild: (guildId, options) =>
      HttpClientRequest.make("POST")(`/guilds/${guildId}/bulk-ban`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listGuildChannels: guildId =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/channels`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    createGuildChannel: (guildId, options) =>
      HttpClientRequest.make("POST")(`/guilds/${guildId}/channels`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    bulkUpdateGuildChannels: (guildId, options) =>
      HttpClientRequest.make("PATCH")(`/guilds/${guildId}/channels`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest([], {})),
      ),
    listGuildEmojis: guildId =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/emojis`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    createGuildEmoji: (guildId, options) =>
      HttpClientRequest.make("POST")(`/guilds/${guildId}/emojis`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGuildEmoji: (guildId, emojiId) =>
      HttpClientRequest.make("GET")(
        `/guilds/${guildId}/emojis/${emojiId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    deleteGuildEmoji: (guildId, emojiId) =>
      HttpClientRequest.make("DELETE")(
        `/guilds/${guildId}/emojis/${emojiId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    updateGuildEmoji: (guildId, emojiId, options) =>
      HttpClientRequest.make("PATCH")(
        `/guilds/${guildId}/emojis/${emojiId}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listGuildIntegrations: guildId =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/integrations`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    deleteGuildIntegration: (guildId, integrationId) =>
      HttpClientRequest.make("DELETE")(
        `/guilds/${guildId}/integrations/${integrationId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    listGuildInvites: guildId =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/invites`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listGuildMembers: (guildId, options) =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/members`).pipe(
        HttpClientRequest.setUrlParams({
          limit: options["limit"] as UrlParams.Coercible,
          after: options["after"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    updateMyGuildMember: (guildId, options) =>
      HttpClientRequest.make("PATCH")(`/guilds/${guildId}/members/@me`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    searchGuildMembers: (guildId, options) =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/members/search`).pipe(
        HttpClientRequest.setUrlParams({
          limit: options["limit"] as UrlParams.Coercible,
          query: options["query"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGuildMember: (guildId, userId) =>
      HttpClientRequest.make("GET")(
        `/guilds/${guildId}/members/${userId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    addGuildMember: (guildId, userId, options) =>
      HttpClientRequest.make("PUT")(
        `/guilds/${guildId}/members/${userId}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    deleteGuildMember: (guildId, userId) =>
      HttpClientRequest.make("DELETE")(
        `/guilds/${guildId}/members/${userId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    updateGuildMember: (guildId, userId, options) =>
      HttpClientRequest.make("PATCH")(
        `/guilds/${guildId}/members/${userId}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    addGuildMemberRole: (guildId, userId, roleId) =>
      HttpClientRequest.make("PUT")(
        `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    deleteGuildMemberRole: (guildId, userId, roleId) =>
      HttpClientRequest.make("DELETE")(
        `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    setGuildMfaLevel: (guildId, options) =>
      HttpClientRequest.make("POST")(`/guilds/${guildId}/mfa`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGuildNewMemberWelcome: guildId =>
      HttpClientRequest.make("GET")(
        `/guilds/${guildId}/new-member-welcome`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    getGuildsOnboarding: guildId =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/onboarding`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    putGuildsOnboarding: (guildId, options) =>
      HttpClientRequest.make("PUT")(`/guilds/${guildId}/onboarding`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGuildPreview: guildId =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/preview`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    previewPruneGuild: (guildId, options) =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/prune`).pipe(
        HttpClientRequest.setUrlParams({
          days: options["days"] as UrlParams.Coercible,
          include_roles: options["include_roles"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    pruneGuild: (guildId, options) =>
      HttpClientRequest.make("POST")(`/guilds/${guildId}/prune`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listGuildVoiceRegions: guildId =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/regions`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listGuildRoles: guildId =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/roles`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    createGuildRole: (guildId, options) =>
      HttpClientRequest.make("POST")(`/guilds/${guildId}/roles`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    bulkUpdateGuildRoles: (guildId, options) =>
      HttpClientRequest.make("PATCH")(`/guilds/${guildId}/roles`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGuildRole: (guildId, roleId) =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/roles/${roleId}`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    deleteGuildRole: (guildId, roleId) =>
      HttpClientRequest.make("DELETE")(
        `/guilds/${guildId}/roles/${roleId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    updateGuildRole: (guildId, roleId, options) =>
      HttpClientRequest.make("PATCH")(
        `/guilds/${guildId}/roles/${roleId}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listGuildScheduledEvents: (guildId, options) =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/scheduled-events`).pipe(
        HttpClientRequest.setUrlParams({
          with_user_count: options["with_user_count"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    createGuildScheduledEvent: (guildId, options) =>
      HttpClientRequest.make("POST")(
        `/guilds/${guildId}/scheduled-events`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGuildScheduledEvent: (guildId, guildScheduledEventId, options) =>
      HttpClientRequest.make("GET")(
        `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          with_user_count: options["with_user_count"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    deleteGuildScheduledEvent: (guildId, guildScheduledEventId) =>
      HttpClientRequest.make("DELETE")(
        `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    updateGuildScheduledEvent: (guildId, guildScheduledEventId, options) =>
      HttpClientRequest.make("PATCH")(
        `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listGuildScheduledEventUsers: (guildId, guildScheduledEventId, options) =>
      HttpClientRequest.make("GET")(
        `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}/users`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          with_member: options["with_member"] as UrlParams.Coercible,
          limit: options["limit"] as UrlParams.Coercible,
          before: options["before"] as UrlParams.Coercible,
          after: options["after"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listGuildSoundboardSounds: guildId =>
      HttpClientRequest.make("GET")(
        `/guilds/${guildId}/soundboard-sounds`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    createGuildSoundboardSound: (guildId, options) =>
      HttpClientRequest.make("POST")(
        `/guilds/${guildId}/soundboard-sounds`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGuildSoundboardSound: (guildId, soundId) =>
      HttpClientRequest.make("GET")(
        `/guilds/${guildId}/soundboard-sounds/${soundId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    deleteGuildSoundboardSound: (guildId, soundId) =>
      HttpClientRequest.make("DELETE")(
        `/guilds/${guildId}/soundboard-sounds/${soundId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    updateGuildSoundboardSound: (guildId, soundId, options) =>
      HttpClientRequest.make("PATCH")(
        `/guilds/${guildId}/soundboard-sounds/${soundId}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listGuildStickers: guildId =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/stickers`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    createGuildSticker: (guildId, options) =>
      HttpClientRequest.make("POST")(`/guilds/${guildId}/stickers`).pipe(
        HttpClientRequest.bodyFormData(options),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGuildSticker: (guildId, stickerId) =>
      HttpClientRequest.make("GET")(
        `/guilds/${guildId}/stickers/${stickerId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    deleteGuildSticker: (guildId, stickerId) =>
      HttpClientRequest.make("DELETE")(
        `/guilds/${guildId}/stickers/${stickerId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    updateGuildSticker: (guildId, stickerId, options) =>
      HttpClientRequest.make("PATCH")(
        `/guilds/${guildId}/stickers/${stickerId}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listGuildTemplates: guildId =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/templates`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    createGuildTemplate: (guildId, options) =>
      HttpClientRequest.make("POST")(`/guilds/${guildId}/templates`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    syncGuildTemplate: (guildId, code) =>
      HttpClientRequest.make("PUT")(
        `/guilds/${guildId}/templates/${code}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    deleteGuildTemplate: (guildId, code) =>
      HttpClientRequest.make("DELETE")(
        `/guilds/${guildId}/templates/${code}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    updateGuildTemplate: (guildId, code, options) =>
      HttpClientRequest.make("PATCH")(
        `/guilds/${guildId}/templates/${code}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getActiveGuildThreads: guildId =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/threads/active`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGuildVanityUrl: guildId =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/vanity-url`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getSelfVoiceState: guildId =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/voice-states/@me`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    updateSelfVoiceState: (guildId, options) =>
      HttpClientRequest.make("PATCH")(
        `/guilds/${guildId}/voice-states/@me`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest([], {})),
      ),
    getVoiceState: (guildId, userId) =>
      HttpClientRequest.make("GET")(
        `/guilds/${guildId}/voice-states/${userId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    updateVoiceState: (guildId, userId, options) =>
      HttpClientRequest.make("PATCH")(
        `/guilds/${guildId}/voice-states/${userId}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest([], {})),
      ),
    getGuildWebhooks: guildId =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/webhooks`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGuildWelcomeScreen: guildId =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/welcome-screen`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    updateGuildWelcomeScreen: (guildId, options) =>
      HttpClientRequest.make("PATCH")(`/guilds/${guildId}/welcome-screen`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGuildWidgetSettings: guildId =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/widget`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    updateGuildWidgetSettings: (guildId, options) =>
      HttpClientRequest.make("PATCH")(`/guilds/${guildId}/widget`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGuildWidget: guildId =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/widget.json`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getGuildWidgetPng: (guildId, options) =>
      HttpClientRequest.make("GET")(`/guilds/${guildId}/widget.png`).pipe(
        HttpClientRequest.setUrlParams({
          style: options["style"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest([], {})),
      ),
    createInteractionResponse: (interactionId, interactionToken, options) =>
      HttpClientRequest.make("POST")(
        `/interactions/${interactionId}/${interactionToken}/callback`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          with_response: options.params["with_response"] as UrlParams.Coercible,
        }),
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options.payload)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    inviteResolve: (code, options) =>
      HttpClientRequest.make("GET")(`/invites/${code}`).pipe(
        HttpClientRequest.setUrlParams({
          with_counts: options["with_counts"] as UrlParams.Coercible,
          guild_scheduled_event_id: options[
            "guild_scheduled_event_id"
          ] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    inviteRevoke: code =>
      HttpClientRequest.make("DELETE")(`/invites/${code}`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    createOrJoinLobby: options =>
      HttpClientRequest.make("PUT")(`/lobbies`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    createLobby: options =>
      HttpClientRequest.make("POST")(`/lobbies`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getLobby: lobbyId =>
      HttpClientRequest.make("GET")(`/lobbies/${lobbyId}`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    editLobby: (lobbyId, options) =>
      HttpClientRequest.make("PATCH")(`/lobbies/${lobbyId}`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    editLobbyChannelLink: (lobbyId, options) =>
      HttpClientRequest.make("PATCH")(
        `/lobbies/${lobbyId}/channel-linking`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    leaveLobby: lobbyId =>
      HttpClientRequest.make("DELETE")(`/lobbies/${lobbyId}/members/@me`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest([], {})),
      ),
    addLobbyMember: (lobbyId, userId, options) =>
      HttpClientRequest.make("PUT")(
        `/lobbies/${lobbyId}/members/${userId}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    deleteLobbyMember: (lobbyId, userId) =>
      HttpClientRequest.make("DELETE")(
        `/lobbies/${lobbyId}/members/${userId}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    createLobbyMessage: (lobbyId, options) =>
      HttpClientRequest.make("POST")(`/lobbies/${lobbyId}/messages`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getMyOauth2Authorization: () =>
      HttpClientRequest.make("GET")(`/oauth2/@me`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getMyOauth2Application: () =>
      HttpClientRequest.make("GET")(`/oauth2/applications/@me`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getPublicKeys: () =>
      HttpClientRequest.make("GET")(`/oauth2/keys`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getOpenidConnectUserinfo: () =>
      HttpClientRequest.make("GET")(`/oauth2/userinfo`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    partnerSdkUnmergeProvisionalAccount: options =>
      HttpClientRequest.make("POST")(
        `/partner-sdk/provisional-accounts/unmerge`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest([], {})),
      ),
    partnerSdkToken: options =>
      HttpClientRequest.make("POST")(`/partner-sdk/token`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getSoundboardDefaultSounds: () =>
      HttpClientRequest.make("GET")(`/soundboard-default-sounds`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    createStageInstance: options =>
      HttpClientRequest.make("POST")(`/stage-instances`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getStageInstance: channelId =>
      HttpClientRequest.make("GET")(`/stage-instances/${channelId}`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    deleteStageInstance: channelId =>
      HttpClientRequest.make("DELETE")(`/stage-instances/${channelId}`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest([], {})),
      ),
    updateStageInstance: (channelId, options) =>
      HttpClientRequest.make("PATCH")(`/stage-instances/${channelId}`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listStickerPacks: () =>
      HttpClientRequest.make("GET")(`/sticker-packs`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getStickerPack: packId =>
      HttpClientRequest.make("GET")(`/sticker-packs/${packId}`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getSticker: stickerId =>
      HttpClientRequest.make("GET")(`/stickers/${stickerId}`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getMyUser: () =>
      HttpClientRequest.make("GET")(`/users/@me`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    updateMyUser: options =>
      HttpClientRequest.make("PATCH")(`/users/@me`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getApplicationUserRoleConnection: applicationId =>
      HttpClientRequest.make("GET")(
        `/users/@me/applications/${applicationId}/role-connection`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    updateApplicationUserRoleConnection: (applicationId, options) =>
      HttpClientRequest.make("PUT")(
        `/users/@me/applications/${applicationId}/role-connection`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    deleteApplicationUserRoleConnection: applicationId =>
      HttpClientRequest.make("DELETE")(
        `/users/@me/applications/${applicationId}/role-connection`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    createDm: options =>
      HttpClientRequest.make("POST")(`/users/@me/channels`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listMyConnections: () =>
      HttpClientRequest.make("GET")(`/users/@me/connections`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listMyGuilds: options =>
      HttpClientRequest.make("GET")(`/users/@me/guilds`).pipe(
        HttpClientRequest.setUrlParams({
          before: options["before"] as UrlParams.Coercible,
          after: options["after"] as UrlParams.Coercible,
          limit: options["limit"] as UrlParams.Coercible,
          with_counts: options["with_counts"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    leaveGuild: guildId =>
      HttpClientRequest.make("DELETE")(`/users/@me/guilds/${guildId}`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest([], {})),
      ),
    getMyGuildMember: guildId =>
      HttpClientRequest.make("GET")(`/users/@me/guilds/${guildId}/member`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getUser: userId =>
      HttpClientRequest.make("GET")(`/users/${userId}`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    listVoiceRegions: () =>
      HttpClientRequest.make("GET")(`/voice/regions`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getWebhook: webhookId =>
      HttpClientRequest.make("GET")(`/webhooks/${webhookId}`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    deleteWebhook: webhookId =>
      HttpClientRequest.make("DELETE")(`/webhooks/${webhookId}`).pipe(
        Effect.succeed,
        Effect.flatMap(onRequest([], {})),
      ),
    updateWebhook: (webhookId, options) =>
      HttpClientRequest.make("PATCH")(`/webhooks/${webhookId}`).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getWebhookByToken: (webhookId, webhookToken) =>
      HttpClientRequest.make("GET")(
        `/webhooks/${webhookId}/${webhookToken}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest(["2xx"], {}))),
    executeWebhook: (webhookId, webhookToken, options) =>
      HttpClientRequest.make("POST")(
        `/webhooks/${webhookId}/${webhookToken}`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          wait: options.params["wait"] as UrlParams.Coercible,
          thread_id: options.params["thread_id"] as UrlParams.Coercible,
          with_components: options.params[
            "with_components"
          ] as UrlParams.Coercible,
        }),
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options.payload)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    deleteWebhookByToken: (webhookId, webhookToken) =>
      HttpClientRequest.make("DELETE")(
        `/webhooks/${webhookId}/${webhookToken}`,
      ).pipe(Effect.succeed, Effect.flatMap(onRequest([], {}))),
    updateWebhookByToken: (webhookId, webhookToken, options) =>
      HttpClientRequest.make("PATCH")(
        `/webhooks/${webhookId}/${webhookToken}`,
      ).pipe(
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    executeGithubCompatibleWebhook: (webhookId, webhookToken, options) =>
      HttpClientRequest.make("POST")(
        `/webhooks/${webhookId}/${webhookToken}/github`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          wait: options.params["wait"] as UrlParams.Coercible,
          thread_id: options.params["thread_id"] as UrlParams.Coercible,
        }),
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options.payload)),
        Effect.flatMap(onRequest([], {})),
      ),
    getOriginalWebhookMessage: (webhookId, webhookToken, options) =>
      HttpClientRequest.make("GET")(
        `/webhooks/${webhookId}/${webhookToken}/messages/@original`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          thread_id: options["thread_id"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    deleteOriginalWebhookMessage: (webhookId, webhookToken, options) =>
      HttpClientRequest.make("DELETE")(
        `/webhooks/${webhookId}/${webhookToken}/messages/@original`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          thread_id: options["thread_id"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest([], {})),
      ),
    updateOriginalWebhookMessage: (webhookId, webhookToken, options) =>
      HttpClientRequest.make("PATCH")(
        `/webhooks/${webhookId}/${webhookToken}/messages/@original`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          thread_id: options.params["thread_id"] as UrlParams.Coercible,
          with_components: options.params[
            "with_components"
          ] as UrlParams.Coercible,
        }),
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options.payload)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    getWebhookMessage: (webhookId, webhookToken, messageId, options) =>
      HttpClientRequest.make("GET")(
        `/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          thread_id: options["thread_id"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    deleteWebhookMessage: (webhookId, webhookToken, messageId, options) =>
      HttpClientRequest.make("DELETE")(
        `/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          thread_id: options["thread_id"] as UrlParams.Coercible,
        }),
        Effect.succeed,
        Effect.flatMap(onRequest([], {})),
      ),
    updateWebhookMessage: (webhookId, webhookToken, messageId, options) =>
      HttpClientRequest.make("PATCH")(
        `/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          thread_id: options.params["thread_id"] as UrlParams.Coercible,
          with_components: options.params[
            "with_components"
          ] as UrlParams.Coercible,
        }),
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options.payload)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
    executeSlackCompatibleWebhook: (webhookId, webhookToken, options) =>
      HttpClientRequest.make("POST")(
        `/webhooks/${webhookId}/${webhookToken}/slack`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          wait: options.params["wait"] as UrlParams.Coercible,
          thread_id: options.params["thread_id"] as UrlParams.Coercible,
        }),
        req => Effect.orDie(HttpClientRequest.bodyJson(req, options.payload)),
        Effect.flatMap(onRequest(["2xx"], {})),
      ),
  }
}

export interface DiscordRest {
  readonly httpClient: HttpClient.HttpClient
  readonly getMyApplication: () => Effect.Effect<
    PrivateApplicationResponse,
    HttpClientError.HttpClientError
  >
  readonly updateMyApplication: (
    options: ApplicationFormPartial,
  ) => Effect.Effect<
    PrivateApplicationResponse,
    HttpClientError.HttpClientError
  >
  readonly getApplication: (
    applicationId: string,
  ) => Effect.Effect<
    PrivateApplicationResponse,
    HttpClientError.HttpClientError
  >
  readonly updateApplication: (
    applicationId: string,
    options: ApplicationFormPartial,
  ) => Effect.Effect<
    PrivateApplicationResponse,
    HttpClientError.HttpClientError
  >
  readonly applicationsGetActivityInstance: (
    applicationId: string,
    instanceId: string,
  ) => Effect.Effect<EmbeddedActivityInstance, HttpClientError.HttpClientError>
  readonly uploadApplicationAttachment: (
    applicationId: string,
    options: globalThis.FormData,
  ) => Effect.Effect<
    ActivitiesAttachmentResponse,
    HttpClientError.HttpClientError
  >
  readonly listApplicationCommands: (
    applicationId: string,
    options: ListApplicationCommandsParams,
  ) => Effect.Effect<
    ListApplicationCommands200,
    HttpClientError.HttpClientError
  >
  readonly bulkSetApplicationCommands: (
    applicationId: string,
    options: BulkSetApplicationCommandsRequest,
  ) => Effect.Effect<
    BulkSetApplicationCommands200,
    HttpClientError.HttpClientError
  >
  readonly createApplicationCommand: (
    applicationId: string,
    options: ApplicationCommandCreateRequest,
  ) => Effect.Effect<
    ApplicationCommandResponse | ApplicationCommandResponse,
    HttpClientError.HttpClientError
  >
  readonly getApplicationCommand: (
    applicationId: string,
    commandId: string,
  ) => Effect.Effect<
    ApplicationCommandResponse,
    HttpClientError.HttpClientError
  >
  readonly deleteApplicationCommand: (
    applicationId: string,
    commandId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly updateApplicationCommand: (
    applicationId: string,
    commandId: string,
    options: ApplicationCommandPatchRequestPartial,
  ) => Effect.Effect<
    ApplicationCommandResponse,
    HttpClientError.HttpClientError
  >
  readonly listApplicationEmojis: (
    applicationId: string,
  ) => Effect.Effect<
    ListApplicationEmojisResponse,
    HttpClientError.HttpClientError
  >
  readonly createApplicationEmoji: (
    applicationId: string,
    options: CreateApplicationEmojiRequest,
  ) => Effect.Effect<EmojiResponse, HttpClientError.HttpClientError>
  readonly getApplicationEmoji: (
    applicationId: string,
    emojiId: string,
  ) => Effect.Effect<EmojiResponse, HttpClientError.HttpClientError>
  readonly deleteApplicationEmoji: (
    applicationId: string,
    emojiId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly updateApplicationEmoji: (
    applicationId: string,
    emojiId: string,
    options: UpdateApplicationEmojiRequest,
  ) => Effect.Effect<EmojiResponse, HttpClientError.HttpClientError>
  readonly getEntitlements: (
    applicationId: string,
    options: GetEntitlementsParams,
  ) => Effect.Effect<GetEntitlements200, HttpClientError.HttpClientError>
  readonly createEntitlement: (
    applicationId: string,
    options: CreateEntitlementRequestData,
  ) => Effect.Effect<EntitlementResponse, HttpClientError.HttpClientError>
  readonly getEntitlement: (
    applicationId: string,
    entitlementId: string,
  ) => Effect.Effect<EntitlementResponse, HttpClientError.HttpClientError>
  readonly deleteEntitlement: (
    applicationId: string,
    entitlementId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly consumeEntitlement: (
    applicationId: string,
    entitlementId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly listGuildApplicationCommands: (
    applicationId: string,
    guildId: string,
    options: ListGuildApplicationCommandsParams,
  ) => Effect.Effect<
    ListGuildApplicationCommands200,
    HttpClientError.HttpClientError
  >
  readonly bulkSetGuildApplicationCommands: (
    applicationId: string,
    guildId: string,
    options: BulkSetGuildApplicationCommandsRequest,
  ) => Effect.Effect<
    BulkSetGuildApplicationCommands200,
    HttpClientError.HttpClientError
  >
  readonly createGuildApplicationCommand: (
    applicationId: string,
    guildId: string,
    options: ApplicationCommandCreateRequest,
  ) => Effect.Effect<
    ApplicationCommandResponse | ApplicationCommandResponse,
    HttpClientError.HttpClientError
  >
  readonly listGuildApplicationCommandPermissions: (
    applicationId: string,
    guildId: string,
  ) => Effect.Effect<
    ListGuildApplicationCommandPermissions200,
    HttpClientError.HttpClientError
  >
  readonly getGuildApplicationCommand: (
    applicationId: string,
    guildId: string,
    commandId: string,
  ) => Effect.Effect<
    ApplicationCommandResponse,
    HttpClientError.HttpClientError
  >
  readonly deleteGuildApplicationCommand: (
    applicationId: string,
    guildId: string,
    commandId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly updateGuildApplicationCommand: (
    applicationId: string,
    guildId: string,
    commandId: string,
    options: ApplicationCommandPatchRequestPartial,
  ) => Effect.Effect<
    ApplicationCommandResponse,
    HttpClientError.HttpClientError
  >
  readonly getGuildApplicationCommandPermissions: (
    applicationId: string,
    guildId: string,
    commandId: string,
  ) => Effect.Effect<
    CommandPermissionsResponse,
    HttpClientError.HttpClientError
  >
  readonly setGuildApplicationCommandPermissions: (
    applicationId: string,
    guildId: string,
    commandId: string,
    options: SetGuildApplicationCommandPermissionsRequest,
  ) => Effect.Effect<
    CommandPermissionsResponse,
    HttpClientError.HttpClientError
  >
  readonly getApplicationRoleConnectionsMetadata: (
    applicationId: string,
  ) => Effect.Effect<
    GetApplicationRoleConnectionsMetadata200,
    HttpClientError.HttpClientError
  >
  readonly updateApplicationRoleConnectionsMetadata: (
    applicationId: string,
    options: UpdateApplicationRoleConnectionsMetadataRequest,
  ) => Effect.Effect<
    UpdateApplicationRoleConnectionsMetadata200,
    HttpClientError.HttpClientError
  >
  readonly getChannel: (
    channelId: string,
  ) => Effect.Effect<GetChannel200, HttpClientError.HttpClientError>
  readonly deleteChannel: (
    channelId: string,
  ) => Effect.Effect<DeleteChannel200, HttpClientError.HttpClientError>
  readonly updateChannel: (
    channelId: string,
    options: UpdateChannelRequest,
  ) => Effect.Effect<UpdateChannel200, HttpClientError.HttpClientError>
  readonly followChannel: (
    channelId: string,
    options: FollowChannelRequest,
  ) => Effect.Effect<ChannelFollowerResponse, HttpClientError.HttpClientError>
  readonly listChannelInvites: (
    channelId: string,
  ) => Effect.Effect<ListChannelInvites200, HttpClientError.HttpClientError>
  readonly createChannelInvite: (
    channelId: string,
    options: CreateChannelInviteRequest,
  ) => Effect.Effect<CreateChannelInvite200, HttpClientError.HttpClientError>
  readonly listMessages: (
    channelId: string,
    options: ListMessagesParams,
  ) => Effect.Effect<ListMessages200, HttpClientError.HttpClientError>
  readonly createMessage: (
    channelId: string,
    options: MessageCreateRequest,
  ) => Effect.Effect<MessageResponse, HttpClientError.HttpClientError>
  readonly bulkDeleteMessages: (
    channelId: string,
    options: BulkDeleteMessagesRequest,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly getMessage: (
    channelId: string,
    messageId: string,
  ) => Effect.Effect<MessageResponse, HttpClientError.HttpClientError>
  readonly deleteMessage: (
    channelId: string,
    messageId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly updateMessage: (
    channelId: string,
    messageId: string,
    options: MessageEditRequestPartial,
  ) => Effect.Effect<MessageResponse, HttpClientError.HttpClientError>
  readonly crosspostMessage: (
    channelId: string,
    messageId: string,
  ) => Effect.Effect<MessageResponse, HttpClientError.HttpClientError>
  readonly deleteAllMessageReactions: (
    channelId: string,
    messageId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly listMessageReactionsByEmoji: (
    channelId: string,
    messageId: string,
    emojiName: string,
    options: ListMessageReactionsByEmojiParams,
  ) => Effect.Effect<
    ListMessageReactionsByEmoji200,
    HttpClientError.HttpClientError
  >
  readonly deleteAllMessageReactionsByEmoji: (
    channelId: string,
    messageId: string,
    emojiName: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly addMyMessageReaction: (
    channelId: string,
    messageId: string,
    emojiName: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly deleteMyMessageReaction: (
    channelId: string,
    messageId: string,
    emojiName: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly deleteUserMessageReaction: (
    channelId: string,
    messageId: string,
    emojiName: string,
    userId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly createThreadFromMessage: (
    channelId: string,
    messageId: string,
    options: CreateTextThreadWithMessageRequest,
  ) => Effect.Effect<ThreadResponse, HttpClientError.HttpClientError>
  readonly setChannelPermissionOverwrite: (
    channelId: string,
    overwriteId: string,
    options: SetChannelPermissionOverwriteRequest,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly deleteChannelPermissionOverwrite: (
    channelId: string,
    overwriteId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly listPinnedMessages: (
    channelId: string,
  ) => Effect.Effect<ListPinnedMessages200, HttpClientError.HttpClientError>
  readonly pinMessage: (
    channelId: string,
    messageId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly unpinMessage: (
    channelId: string,
    messageId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly getAnswerVoters: (
    channelId: string,
    messageId: string,
    answerId: string,
    options: GetAnswerVotersParams,
  ) => Effect.Effect<PollAnswerDetailsResponse, HttpClientError.HttpClientError>
  readonly pollExpire: (
    channelId: string,
    messageId: string,
  ) => Effect.Effect<MessageResponse, HttpClientError.HttpClientError>
  readonly addGroupDmUser: (
    channelId: string,
    userId: string,
    options: AddGroupDmUserRequest,
  ) => Effect.Effect<AddGroupDmUser201, HttpClientError.HttpClientError>
  readonly deleteGroupDmUser: (
    channelId: string,
    userId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly sendSoundboardSound: (
    channelId: string,
    options: SoundboardSoundSendRequest,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly listThreadMembers: (
    channelId: string,
    options: ListThreadMembersParams,
  ) => Effect.Effect<ListThreadMembers200, HttpClientError.HttpClientError>
  readonly joinThread: (
    channelId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly leaveThread: (
    channelId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly getThreadMember: (
    channelId: string,
    userId: string,
    options: GetThreadMemberParams,
  ) => Effect.Effect<ThreadMemberResponse, HttpClientError.HttpClientError>
  readonly addThreadMember: (
    channelId: string,
    userId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly deleteThreadMember: (
    channelId: string,
    userId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly createThread: (
    channelId: string,
    options: CreateThreadRequest,
  ) => Effect.Effect<CreatedThreadResponse, HttpClientError.HttpClientError>
  readonly listPrivateArchivedThreads: (
    channelId: string,
    options: ListPrivateArchivedThreadsParams,
  ) => Effect.Effect<ThreadsResponse, HttpClientError.HttpClientError>
  readonly listPublicArchivedThreads: (
    channelId: string,
    options: ListPublicArchivedThreadsParams,
  ) => Effect.Effect<ThreadsResponse, HttpClientError.HttpClientError>
  readonly threadSearch: (
    channelId: string,
    options: ThreadSearchParams,
  ) => Effect.Effect<ThreadSearchResponse, HttpClientError.HttpClientError>
  readonly triggerTypingIndicator: (
    channelId: string,
  ) => Effect.Effect<TypingIndicatorResponse, HttpClientError.HttpClientError>
  readonly listMyPrivateArchivedThreads: (
    channelId: string,
    options: ListMyPrivateArchivedThreadsParams,
  ) => Effect.Effect<ThreadsResponse, HttpClientError.HttpClientError>
  readonly listChannelWebhooks: (
    channelId: string,
  ) => Effect.Effect<ListChannelWebhooks200, HttpClientError.HttpClientError>
  readonly createWebhook: (
    channelId: string,
    options: CreateWebhookRequest,
  ) => Effect.Effect<
    GuildIncomingWebhookResponse,
    HttpClientError.HttpClientError
  >
  readonly getGateway: () => Effect.Effect<
    GatewayResponse,
    HttpClientError.HttpClientError
  >
  readonly getBotGateway: () => Effect.Effect<
    GatewayBotResponse,
    HttpClientError.HttpClientError
  >
  readonly createGuild: (
    options: GuildCreateRequest,
  ) => Effect.Effect<GuildResponse, HttpClientError.HttpClientError>
  readonly getGuildTemplate: (
    code: string,
  ) => Effect.Effect<GuildTemplateResponse, HttpClientError.HttpClientError>
  readonly createGuildFromTemplate: (
    code: string,
    options: CreateGuildFromTemplateRequest,
  ) => Effect.Effect<GuildResponse, HttpClientError.HttpClientError>
  readonly getGuild: (
    guildId: string,
    options: GetGuildParams,
  ) => Effect.Effect<GuildWithCountsResponse, HttpClientError.HttpClientError>
  readonly deleteGuild: (
    guildId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly updateGuild: (
    guildId: string,
    options: GuildPatchRequestPartial,
  ) => Effect.Effect<GuildResponse, HttpClientError.HttpClientError>
  readonly listGuildAuditLogEntries: (
    guildId: string,
    options: ListGuildAuditLogEntriesParams,
  ) => Effect.Effect<GuildAuditLogResponse, HttpClientError.HttpClientError>
  readonly listAutoModerationRules: (
    guildId: string,
  ) => Effect.Effect<
    ListAutoModerationRules200,
    HttpClientError.HttpClientError
  >
  readonly createAutoModerationRule: (
    guildId: string,
    options: CreateAutoModerationRuleRequest,
  ) => Effect.Effect<
    CreateAutoModerationRule200,
    HttpClientError.HttpClientError
  >
  readonly getAutoModerationRule: (
    guildId: string,
    ruleId: string,
  ) => Effect.Effect<GetAutoModerationRule200, HttpClientError.HttpClientError>
  readonly deleteAutoModerationRule: (
    guildId: string,
    ruleId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly updateAutoModerationRule: (
    guildId: string,
    ruleId: string,
    options: UpdateAutoModerationRuleRequest,
  ) => Effect.Effect<
    UpdateAutoModerationRule200,
    HttpClientError.HttpClientError
  >
  readonly listGuildBans: (
    guildId: string,
    options: ListGuildBansParams,
  ) => Effect.Effect<ListGuildBans200, HttpClientError.HttpClientError>
  readonly getGuildBan: (
    guildId: string,
    userId: string,
  ) => Effect.Effect<GuildBanResponse, HttpClientError.HttpClientError>
  readonly banUserFromGuild: (
    guildId: string,
    userId: string,
    options: BanUserFromGuildRequest,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly unbanUserFromGuild: (
    guildId: string,
    userId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly bulkBanUsersFromGuild: (
    guildId: string,
    options: BulkBanUsersFromGuildRequest,
  ) => Effect.Effect<BulkBanUsersResponse, HttpClientError.HttpClientError>
  readonly listGuildChannels: (
    guildId: string,
  ) => Effect.Effect<ListGuildChannels200, HttpClientError.HttpClientError>
  readonly createGuildChannel: (
    guildId: string,
    options: CreateGuildChannelRequest,
  ) => Effect.Effect<GuildChannelResponse, HttpClientError.HttpClientError>
  readonly bulkUpdateGuildChannels: (
    guildId: string,
    options: BulkUpdateGuildChannelsRequest,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly listGuildEmojis: (
    guildId: string,
  ) => Effect.Effect<ListGuildEmojis200, HttpClientError.HttpClientError>
  readonly createGuildEmoji: (
    guildId: string,
    options: CreateGuildEmojiRequest,
  ) => Effect.Effect<EmojiResponse, HttpClientError.HttpClientError>
  readonly getGuildEmoji: (
    guildId: string,
    emojiId: string,
  ) => Effect.Effect<EmojiResponse, HttpClientError.HttpClientError>
  readonly deleteGuildEmoji: (
    guildId: string,
    emojiId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly updateGuildEmoji: (
    guildId: string,
    emojiId: string,
    options: UpdateGuildEmojiRequest,
  ) => Effect.Effect<EmojiResponse, HttpClientError.HttpClientError>
  readonly listGuildIntegrations: (
    guildId: string,
  ) => Effect.Effect<ListGuildIntegrations200, HttpClientError.HttpClientError>
  readonly deleteGuildIntegration: (
    guildId: string,
    integrationId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly listGuildInvites: (
    guildId: string,
  ) => Effect.Effect<ListGuildInvites200, HttpClientError.HttpClientError>
  readonly listGuildMembers: (
    guildId: string,
    options: ListGuildMembersParams,
  ) => Effect.Effect<ListGuildMembers200, HttpClientError.HttpClientError>
  readonly updateMyGuildMember: (
    guildId: string,
    options: UpdateMyGuildMemberRequest,
  ) => Effect.Effect<
    PrivateGuildMemberResponse,
    HttpClientError.HttpClientError
  >
  readonly searchGuildMembers: (
    guildId: string,
    options: SearchGuildMembersParams,
  ) => Effect.Effect<SearchGuildMembers200, HttpClientError.HttpClientError>
  readonly getGuildMember: (
    guildId: string,
    userId: string,
  ) => Effect.Effect<GuildMemberResponse, HttpClientError.HttpClientError>
  readonly addGuildMember: (
    guildId: string,
    userId: string,
    options: AddGuildMemberRequest,
  ) => Effect.Effect<GuildMemberResponse, HttpClientError.HttpClientError>
  readonly deleteGuildMember: (
    guildId: string,
    userId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly updateGuildMember: (
    guildId: string,
    userId: string,
    options: UpdateGuildMemberRequest,
  ) => Effect.Effect<GuildMemberResponse, HttpClientError.HttpClientError>
  readonly addGuildMemberRole: (
    guildId: string,
    userId: string,
    roleId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly deleteGuildMemberRole: (
    guildId: string,
    userId: string,
    roleId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly setGuildMfaLevel: (
    guildId: string,
    options: SetGuildMfaLevelRequest,
  ) => Effect.Effect<GuildMFALevelResponse, HttpClientError.HttpClientError>
  readonly getGuildNewMemberWelcome: (
    guildId: string,
  ) => Effect.Effect<GuildHomeSettingsResponse, HttpClientError.HttpClientError>
  readonly getGuildsOnboarding: (
    guildId: string,
  ) => Effect.Effect<
    UserGuildOnboardingResponse,
    HttpClientError.HttpClientError
  >
  readonly putGuildsOnboarding: (
    guildId: string,
    options: UpdateGuildOnboardingRequest,
  ) => Effect.Effect<GuildOnboardingResponse, HttpClientError.HttpClientError>
  readonly getGuildPreview: (
    guildId: string,
  ) => Effect.Effect<GuildPreviewResponse, HttpClientError.HttpClientError>
  readonly previewPruneGuild: (
    guildId: string,
    options: PreviewPruneGuildParams,
  ) => Effect.Effect<GuildPruneResponse, HttpClientError.HttpClientError>
  readonly pruneGuild: (
    guildId: string,
    options: PruneGuildRequest,
  ) => Effect.Effect<GuildPruneResponse, HttpClientError.HttpClientError>
  readonly listGuildVoiceRegions: (
    guildId: string,
  ) => Effect.Effect<ListGuildVoiceRegions200, HttpClientError.HttpClientError>
  readonly listGuildRoles: (
    guildId: string,
  ) => Effect.Effect<ListGuildRoles200, HttpClientError.HttpClientError>
  readonly createGuildRole: (
    guildId: string,
    options: CreateGuildRoleRequest,
  ) => Effect.Effect<GuildRoleResponse, HttpClientError.HttpClientError>
  readonly bulkUpdateGuildRoles: (
    guildId: string,
    options: BulkUpdateGuildRolesRequest,
  ) => Effect.Effect<BulkUpdateGuildRoles200, HttpClientError.HttpClientError>
  readonly getGuildRole: (
    guildId: string,
    roleId: string,
  ) => Effect.Effect<GuildRoleResponse, HttpClientError.HttpClientError>
  readonly deleteGuildRole: (
    guildId: string,
    roleId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly updateGuildRole: (
    guildId: string,
    roleId: string,
    options: UpdateGuildRoleRequest,
  ) => Effect.Effect<GuildRoleResponse, HttpClientError.HttpClientError>
  readonly listGuildScheduledEvents: (
    guildId: string,
    options: ListGuildScheduledEventsParams,
  ) => Effect.Effect<
    ListGuildScheduledEvents200,
    HttpClientError.HttpClientError
  >
  readonly createGuildScheduledEvent: (
    guildId: string,
    options: CreateGuildScheduledEventRequest,
  ) => Effect.Effect<
    CreateGuildScheduledEvent200,
    HttpClientError.HttpClientError
  >
  readonly getGuildScheduledEvent: (
    guildId: string,
    guildScheduledEventId: string,
    options: GetGuildScheduledEventParams,
  ) => Effect.Effect<GetGuildScheduledEvent200, HttpClientError.HttpClientError>
  readonly deleteGuildScheduledEvent: (
    guildId: string,
    guildScheduledEventId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly updateGuildScheduledEvent: (
    guildId: string,
    guildScheduledEventId: string,
    options: UpdateGuildScheduledEventRequest,
  ) => Effect.Effect<
    UpdateGuildScheduledEvent200,
    HttpClientError.HttpClientError
  >
  readonly listGuildScheduledEventUsers: (
    guildId: string,
    guildScheduledEventId: string,
    options: ListGuildScheduledEventUsersParams,
  ) => Effect.Effect<
    ListGuildScheduledEventUsers200,
    HttpClientError.HttpClientError
  >
  readonly listGuildSoundboardSounds: (
    guildId: string,
  ) => Effect.Effect<
    ListGuildSoundboardSoundsResponse,
    HttpClientError.HttpClientError
  >
  readonly createGuildSoundboardSound: (
    guildId: string,
    options: SoundboardCreateRequest,
  ) => Effect.Effect<SoundboardSoundResponse, HttpClientError.HttpClientError>
  readonly getGuildSoundboardSound: (
    guildId: string,
    soundId: string,
  ) => Effect.Effect<SoundboardSoundResponse, HttpClientError.HttpClientError>
  readonly deleteGuildSoundboardSound: (
    guildId: string,
    soundId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly updateGuildSoundboardSound: (
    guildId: string,
    soundId: string,
    options: SoundboardPatchRequestPartial,
  ) => Effect.Effect<SoundboardSoundResponse, HttpClientError.HttpClientError>
  readonly listGuildStickers: (
    guildId: string,
  ) => Effect.Effect<ListGuildStickers200, HttpClientError.HttpClientError>
  readonly createGuildSticker: (
    guildId: string,
    options: globalThis.FormData,
  ) => Effect.Effect<GuildStickerResponse, HttpClientError.HttpClientError>
  readonly getGuildSticker: (
    guildId: string,
    stickerId: string,
  ) => Effect.Effect<GuildStickerResponse, HttpClientError.HttpClientError>
  readonly deleteGuildSticker: (
    guildId: string,
    stickerId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly updateGuildSticker: (
    guildId: string,
    stickerId: string,
    options: UpdateGuildStickerRequest,
  ) => Effect.Effect<GuildStickerResponse, HttpClientError.HttpClientError>
  readonly listGuildTemplates: (
    guildId: string,
  ) => Effect.Effect<ListGuildTemplates200, HttpClientError.HttpClientError>
  readonly createGuildTemplate: (
    guildId: string,
    options: CreateGuildTemplateRequest,
  ) => Effect.Effect<GuildTemplateResponse, HttpClientError.HttpClientError>
  readonly syncGuildTemplate: (
    guildId: string,
    code: string,
  ) => Effect.Effect<GuildTemplateResponse, HttpClientError.HttpClientError>
  readonly deleteGuildTemplate: (
    guildId: string,
    code: string,
  ) => Effect.Effect<GuildTemplateResponse, HttpClientError.HttpClientError>
  readonly updateGuildTemplate: (
    guildId: string,
    code: string,
    options: UpdateGuildTemplateRequest,
  ) => Effect.Effect<GuildTemplateResponse, HttpClientError.HttpClientError>
  readonly getActiveGuildThreads: (
    guildId: string,
  ) => Effect.Effect<ThreadsResponse, HttpClientError.HttpClientError>
  readonly getGuildVanityUrl: (
    guildId: string,
  ) => Effect.Effect<VanityURLResponse, HttpClientError.HttpClientError>
  readonly getSelfVoiceState: (
    guildId: string,
  ) => Effect.Effect<VoiceStateResponse, HttpClientError.HttpClientError>
  readonly updateSelfVoiceState: (
    guildId: string,
    options: UpdateSelfVoiceStateRequest,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly getVoiceState: (
    guildId: string,
    userId: string,
  ) => Effect.Effect<VoiceStateResponse, HttpClientError.HttpClientError>
  readonly updateVoiceState: (
    guildId: string,
    userId: string,
    options: UpdateVoiceStateRequest,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly getGuildWebhooks: (
    guildId: string,
  ) => Effect.Effect<GetGuildWebhooks200, HttpClientError.HttpClientError>
  readonly getGuildWelcomeScreen: (
    guildId: string,
  ) => Effect.Effect<
    GuildWelcomeScreenResponse,
    HttpClientError.HttpClientError
  >
  readonly updateGuildWelcomeScreen: (
    guildId: string,
    options: WelcomeScreenPatchRequestPartial,
  ) => Effect.Effect<
    GuildWelcomeScreenResponse,
    HttpClientError.HttpClientError
  >
  readonly getGuildWidgetSettings: (
    guildId: string,
  ) => Effect.Effect<WidgetSettingsResponse, HttpClientError.HttpClientError>
  readonly updateGuildWidgetSettings: (
    guildId: string,
    options: UpdateGuildWidgetSettingsRequest,
  ) => Effect.Effect<WidgetSettingsResponse, HttpClientError.HttpClientError>
  readonly getGuildWidget: (
    guildId: string,
  ) => Effect.Effect<WidgetResponse, HttpClientError.HttpClientError>
  readonly getGuildWidgetPng: (
    guildId: string,
    options: GetGuildWidgetPngParams,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly createInteractionResponse: (
    interactionId: string,
    interactionToken: string,
    options: {
      readonly params: CreateInteractionResponseParams
      readonly payload: CreateInteractionResponseRequest
    },
  ) => Effect.Effect<
    InteractionCallbackResponse,
    HttpClientError.HttpClientError
  >
  readonly inviteResolve: (
    code: string,
    options: InviteResolveParams,
  ) => Effect.Effect<InviteResolve200, HttpClientError.HttpClientError>
  readonly inviteRevoke: (
    code: string,
  ) => Effect.Effect<InviteRevoke200, HttpClientError.HttpClientError>
  readonly createOrJoinLobby: (
    options: CreateOrJoinLobbyRequest,
  ) => Effect.Effect<LobbyResponse, HttpClientError.HttpClientError>
  readonly createLobby: (
    options: CreateLobbyRequest,
  ) => Effect.Effect<LobbyResponse, HttpClientError.HttpClientError>
  readonly getLobby: (
    lobbyId: string,
  ) => Effect.Effect<LobbyResponse, HttpClientError.HttpClientError>
  readonly editLobby: (
    lobbyId: string,
    options: EditLobbyRequest,
  ) => Effect.Effect<LobbyResponse, HttpClientError.HttpClientError>
  readonly editLobbyChannelLink: (
    lobbyId: string,
    options: EditLobbyChannelLinkRequest,
  ) => Effect.Effect<LobbyResponse, HttpClientError.HttpClientError>
  readonly leaveLobby: (
    lobbyId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly addLobbyMember: (
    lobbyId: string,
    userId: string,
    options: AddLobbyMemberRequest,
  ) => Effect.Effect<LobbyMemberResponse, HttpClientError.HttpClientError>
  readonly deleteLobbyMember: (
    lobbyId: string,
    userId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly createLobbyMessage: (
    lobbyId: string,
    options: SDKMessageRequest,
  ) => Effect.Effect<LobbyMessageResponse, HttpClientError.HttpClientError>
  readonly getMyOauth2Authorization: () => Effect.Effect<
    OAuth2GetAuthorizationResponse,
    HttpClientError.HttpClientError
  >
  readonly getMyOauth2Application: () => Effect.Effect<
    PrivateApplicationResponse,
    HttpClientError.HttpClientError
  >
  readonly getPublicKeys: () => Effect.Effect<
    OAuth2GetKeys,
    HttpClientError.HttpClientError
  >
  readonly getOpenidConnectUserinfo: () => Effect.Effect<
    OAuth2GetOpenIDConnectUserInfoResponse,
    HttpClientError.HttpClientError
  >
  readonly partnerSdkUnmergeProvisionalAccount: (
    options: PartnerSdkUnmergeProvisionalAccountRequest,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly partnerSdkToken: (
    options: PartnerSdkTokenRequest,
  ) => Effect.Effect<ProvisionalTokenResponse, HttpClientError.HttpClientError>
  readonly getSoundboardDefaultSounds: () => Effect.Effect<
    GetSoundboardDefaultSounds200,
    HttpClientError.HttpClientError
  >
  readonly createStageInstance: (
    options: CreateStageInstanceRequest,
  ) => Effect.Effect<StageInstanceResponse, HttpClientError.HttpClientError>
  readonly getStageInstance: (
    channelId: string,
  ) => Effect.Effect<StageInstanceResponse, HttpClientError.HttpClientError>
  readonly deleteStageInstance: (
    channelId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly updateStageInstance: (
    channelId: string,
    options: UpdateStageInstanceRequest,
  ) => Effect.Effect<StageInstanceResponse, HttpClientError.HttpClientError>
  readonly listStickerPacks: () => Effect.Effect<
    StickerPackCollectionResponse,
    HttpClientError.HttpClientError
  >
  readonly getStickerPack: (
    packId: string,
  ) => Effect.Effect<StickerPackResponse, HttpClientError.HttpClientError>
  readonly getSticker: (
    stickerId: string,
  ) => Effect.Effect<GetSticker200, HttpClientError.HttpClientError>
  readonly getMyUser: () => Effect.Effect<
    UserPIIResponse,
    HttpClientError.HttpClientError
  >
  readonly updateMyUser: (
    options: BotAccountPatchRequest,
  ) => Effect.Effect<UserPIIResponse, HttpClientError.HttpClientError>
  readonly getApplicationUserRoleConnection: (
    applicationId: string,
  ) => Effect.Effect<
    ApplicationUserRoleConnectionResponse,
    HttpClientError.HttpClientError
  >
  readonly updateApplicationUserRoleConnection: (
    applicationId: string,
    options: UpdateApplicationUserRoleConnectionRequest,
  ) => Effect.Effect<
    ApplicationUserRoleConnectionResponse,
    HttpClientError.HttpClientError
  >
  readonly deleteApplicationUserRoleConnection: (
    applicationId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly createDm: (
    options: CreatePrivateChannelRequest,
  ) => Effect.Effect<CreateDm200, HttpClientError.HttpClientError>
  readonly listMyConnections: () => Effect.Effect<
    ListMyConnections200,
    HttpClientError.HttpClientError
  >
  readonly listMyGuilds: (
    options: ListMyGuildsParams,
  ) => Effect.Effect<ListMyGuilds200, HttpClientError.HttpClientError>
  readonly leaveGuild: (
    guildId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly getMyGuildMember: (
    guildId: string,
  ) => Effect.Effect<
    PrivateGuildMemberResponse,
    HttpClientError.HttpClientError
  >
  readonly getUser: (
    userId: string,
  ) => Effect.Effect<UserResponse, HttpClientError.HttpClientError>
  readonly listVoiceRegions: () => Effect.Effect<
    ListVoiceRegions200,
    HttpClientError.HttpClientError
  >
  readonly getWebhook: (
    webhookId: string,
  ) => Effect.Effect<GetWebhook200, HttpClientError.HttpClientError>
  readonly deleteWebhook: (
    webhookId: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly updateWebhook: (
    webhookId: string,
    options: UpdateWebhookRequest,
  ) => Effect.Effect<UpdateWebhook200, HttpClientError.HttpClientError>
  readonly getWebhookByToken: (
    webhookId: string,
    webhookToken: string,
  ) => Effect.Effect<GetWebhookByToken200, HttpClientError.HttpClientError>
  readonly executeWebhook: (
    webhookId: string,
    webhookToken: string,
    options: {
      readonly params: ExecuteWebhookParams
      readonly payload: ExecuteWebhookRequest
    },
  ) => Effect.Effect<MessageResponse, HttpClientError.HttpClientError>
  readonly deleteWebhookByToken: (
    webhookId: string,
    webhookToken: string,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly updateWebhookByToken: (
    webhookId: string,
    webhookToken: string,
    options: UpdateWebhookByTokenRequest,
  ) => Effect.Effect<UpdateWebhookByToken200, HttpClientError.HttpClientError>
  readonly executeGithubCompatibleWebhook: (
    webhookId: string,
    webhookToken: string,
    options: {
      readonly params: ExecuteGithubCompatibleWebhookParams
      readonly payload: GithubWebhook
    },
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly getOriginalWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    options: GetOriginalWebhookMessageParams,
  ) => Effect.Effect<MessageResponse, HttpClientError.HttpClientError>
  readonly deleteOriginalWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    options: DeleteOriginalWebhookMessageParams,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly updateOriginalWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    options: {
      readonly params: UpdateOriginalWebhookMessageParams
      readonly payload: IncomingWebhookUpdateRequestPartial
    },
  ) => Effect.Effect<MessageResponse, HttpClientError.HttpClientError>
  readonly getWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    messageId: string,
    options: GetWebhookMessageParams,
  ) => Effect.Effect<MessageResponse, HttpClientError.HttpClientError>
  readonly deleteWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    messageId: string,
    options: DeleteWebhookMessageParams,
  ) => Effect.Effect<void, HttpClientError.HttpClientError>
  readonly updateWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    messageId: string,
    options: {
      readonly params: UpdateWebhookMessageParams
      readonly payload: IncomingWebhookUpdateRequestPartial
    },
  ) => Effect.Effect<MessageResponse, HttpClientError.HttpClientError>
  readonly executeSlackCompatibleWebhook: (
    webhookId: string,
    webhookToken: string,
    options: {
      readonly params: ExecuteSlackCompatibleWebhookParams
      readonly payload: SlackWebhook
    },
  ) => Effect.Effect<
    ExecuteSlackCompatibleWebhook200,
    HttpClientError.HttpClientError
  >
}

export interface DiscordRestError<Tag extends string, E> {
  readonly _tag: Tag
  readonly cause: E
}

class DiscordRestErrorImpl extends Data.Error<{ _tag: string; cause: any }> {}

export const DiscordRestError = <Tag extends string, E>(
  tag: Tag,
  cause: E,
): DiscordRestError<Tag, E> =>
  new DiscordRestErrorImpl({ _tag: tag, cause }) as any
