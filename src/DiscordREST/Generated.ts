/* eslint-disable */
import type * as HttpClient from "@effect/platform/HttpClient"
import * as HttpClientError from "@effect/platform/HttpClientError"
import * as HttpClientRequest from "@effect/platform/HttpClientRequest"
import * as HttpClientResponse from "@effect/platform/HttpClientResponse"
import * as Data from "effect/Data"
import * as Effect from "effect/Effect"

export type SnowflakeType = string

export type ApplicationTypes = 4

export type Int53Type = number

export interface UserAvatarDecorationResponse {
  readonly asset: string
  readonly sku_id?: SnowflakeType | null | undefined
}

export type NameplatePalette = string

export interface UserNameplateResponse {
  readonly sku_id?: SnowflakeType | null | undefined
  readonly asset: string
  readonly label: string
  readonly palette: NameplatePalette
}

export interface UserCollectiblesResponse {
  readonly nameplate?: UserNameplateResponse | null | undefined
}

export interface UserPrimaryGuildResponse {
  readonly identity_guild_id?: SnowflakeType | null | undefined
  readonly identity_enabled?: boolean | null | undefined
  readonly tag?: string | null | undefined
  readonly badge?: string | null | undefined
}

export interface UserResponse {
  readonly id: SnowflakeType
  readonly username: string
  readonly avatar?: string | null | undefined
  readonly discriminator: string
  readonly public_flags: number
  readonly flags: Int53Type
  readonly bot?: boolean | undefined
  readonly system?: boolean | undefined
  readonly banner?: string | null | undefined
  readonly accent_color?: number | null | undefined
  readonly global_name?: string | null | undefined
  readonly avatar_decoration_data?:
    | UserAvatarDecorationResponse
    | null
    | undefined
  readonly collectibles?: UserCollectiblesResponse | null | undefined
  readonly primary_guild?: UserPrimaryGuildResponse | null | undefined
}

export const OAuth2Scopes = {
  /**
   * allows /users/@me without email
   */
  IDENTIFY: "identify",
  /**
   * enables /users/@me to return an email
   */
  EMAIL: "email",
  /**
   * allows /users/@me/connections to return linked third-party accounts
   */
  CONNECTIONS: "connections",
  /**
   * allows /users/@me/guilds to return basic information about all of a user's guilds
   */
  GUILDS: "guilds",
  /**
   * allows /guilds/{guild.id}/members/{user.id} to be used for joining users to a guild
   */
  GUILDS_JOIN: "guilds.join",
  /**
   * allows /users/@me/guilds/{guild.id}/member to return a user's member information in a guild
   */
  GUILDS_MEMBERS_READ: "guilds.members.read",
  /**
   * allows your app to join users to a group dm
   */
  GDM_JOIN: "gdm.join",
  /**
   * for oauth2 bots, this puts the bot in the user's selected guild by default
   */
  BOT: "bot",
  /**
   * for local rpc server access, this allows you to control a user's local Discord client - requires Discord approval
   */
  RPC: "rpc",
  /**
   * for local rpc server access, this allows you to receive notifications pushed out to the user - requires Discord approval
   */
  RPC_NOTIFICATIONS_READ: "rpc.notifications.read",
  /**
   * for local rpc server access, this allows you to read a user's voice settings and listen for voice events - requires Discord approval
   */
  RPC_VOICE_READ: "rpc.voice.read",
  /**
   * for local rpc server access, this allows you to update a user's voice settings - requires Discord approval
   */
  RPC_VOICE_WRITE: "rpc.voice.write",
  /**
   * for local rpc server access, this allows you to read a user's video status - requires Discord approval
   */
  RPC_VIDEO_READ: "rpc.video.read",
  /**
   * for local rpc server access, this allows you to update a user's video settings - requires Discord approval
   */
  RPC_VIDEO_WRITE: "rpc.video.write",
  /**
   * for local rpc server access, this allows you to read a user's screenshare status- requires Discord approval
   */
  RPC_SCREENSHARE_READ: "rpc.screenshare.read",
  /**
   * for local rpc server access, this allows you to update a user's screenshare settings- requires Discord approval
   */
  RPC_SCREENSHARE_WRITE: "rpc.screenshare.write",
  /**
   * for local rpc server access, this allows you to update a user's activity - requires Discord approval
   */
  RPC_ACTIVITIES_WRITE: "rpc.activities.write",
  /**
   * this generates a webhook that is returned in the oauth token response for authorization code grants
   */
  WEBHOOK_INCOMING: "webhook.incoming",
  /**
   * for local rpc server api access, this allows you to read messages from all client channels (otherwise restricted to channels/guilds your app creates)
   */
  MESSAGES_READ: "messages.read",
  /**
   * allows your app to upload/update builds for a user's applications - requires Discord approval
   */
  APPLICATIONS_BUILDS_UPLOAD: "applications.builds.upload",
  /**
   * allows your app to read build data for a user's applications
   */
  APPLICATIONS_BUILDS_READ: "applications.builds.read",
  /**
   * allows your app to use commands in a guild
   */
  APPLICATIONS_COMMANDS: "applications.commands",
  /**
   * allows your app to update permissions for its commands in a guild a user has permissions to
   */
  APPLICATIONS_COMMANDS_PERMISSIONS_UPDATE:
    "applications.commands.permissions.update",
  /**
   * allows your app to update its commands using a Bearer token - client credentials grant only
   */
  APPLICATIONS_COMMANDS_UPDATE: "applications.commands.update",
  /**
   * allows your app to read and update store data (SKUs, store listings, achievements, etc.) for a user's applications
   */
  APPLICATIONS_STORE_UPDATE: "applications.store.update",
  /**
   * allows your app to read entitlements for a user's applications
   */
  APPLICATIONS_ENTITLEMENTS: "applications.entitlements",
  /**
   * allows your app to fetch data from a user's "Now Playing/Recently Played" list - requires Discord approval
   */
  ACTIVITIES_READ: "activities.read",
  /**
   * allows your app to update a user's activity - requires Discord approval (NOT REQUIRED FOR GAMESDK ACTIVITY MANAGER)
   */
  ACTIVITIES_WRITE: "activities.write",
  /**
   * allows your app to send activity invites - requires Discord approval (NOT REQUIRED FOR GAMESDK ACTIVITY MANAGER)
   */
  ACTIVITIES_INVITES_WRITE: "activities.invites.write",
  /**
   * allows your app to know a user's friends and implicit relationships - requires Discord approval
   */
  RELATIONSHIPS_READ: "relationships.read",
  /**
   * allows your app to connect to voice on user's behalf and see all the voice members - requires Discord approval
   */
  VOICE: "voice",
  /**
   * allows your app to see information about the user's DMs and group DMs - requires Discord approval
   */
  DM_CHANNELS_READ: "dm_channels.read",
  /**
   * allows your app to update a user's connection and metadata for the app
   */
  ROLE_CONNECTIONS_WRITE: "role_connections.write",
  /**
   * for OpenID Connect, this allows your app to receive user id and basic profile information
   */
  OPENID: "openid",
} as const
export type OAuth2Scopes = (typeof OAuth2Scopes)[keyof typeof OAuth2Scopes]

export interface ApplicationOAuth2InstallParamsResponse {
  readonly scopes: ReadonlyArray<"applications.commands" | "bot">
  readonly permissions: string
}

export const ApplicationExplicitContentFilterTypes = {
  /**
   * inherit guild content filter setting
   */
  INHERIT: 0,
  /**
   * interactions will always be scanned
   */
  ALWAYS: 1,
} as const
export type ApplicationExplicitContentFilterTypes =
  (typeof ApplicationExplicitContentFilterTypes)[keyof typeof ApplicationExplicitContentFilterTypes]

export const TeamMembershipStates = {
  /**
   * User has been invited to the team.
   */
  INVITED: 1,
  /**
   * User has accepted the team invitation.
   */
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
  readonly icon?: string | null | undefined
  readonly name: string
  readonly owner_user_id: SnowflakeType
  readonly members: ReadonlyArray<TeamMemberResponse>
}

export interface PrivateApplicationResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly icon?: string | null | undefined
  readonly description: string
  readonly type?: ApplicationTypes | null | undefined
  readonly cover_image?: string | undefined
  readonly primary_sku_id?: SnowflakeType | undefined
  readonly bot?: UserResponse | undefined
  readonly slug?: string | undefined
  readonly guild_id?: SnowflakeType | undefined
  readonly rpc_origins?: ReadonlyArray<string> | undefined
  readonly bot_public?: boolean | undefined
  readonly bot_require_code_grant?: boolean | undefined
  readonly terms_of_service_url?: string | undefined
  readonly privacy_policy_url?: string | undefined
  readonly custom_install_url?: string | undefined
  readonly install_params?: ApplicationOAuth2InstallParamsResponse | undefined
  readonly integration_types_config?: Record<string, unknown> | undefined
  readonly verify_key: string
  readonly flags: number
  readonly max_participants?: number | null | undefined
  readonly tags?: ReadonlyArray<string> | undefined
  readonly redirect_uris: ReadonlyArray<string>
  readonly interactions_endpoint_url?: string | null | undefined
  readonly role_connections_verification_url?: string | null | undefined
  readonly owner: UserResponse
  readonly approximate_guild_count?: number | null | undefined
  readonly approximate_user_install_count: number
  readonly approximate_user_authorization_count: number
  readonly explicit_content_filter: ApplicationExplicitContentFilterTypes
  readonly team?: TeamResponse | null | undefined
}

/**
 * A single error, either for an API response or a specific field.
 */
export interface RatelimitedResponse {
  /**
   * The number of seconds to wait before retrying your request
   */
  readonly retry_after: number
  /**
   * Whether you are being ratelimited by the global ratelimit or a per-endpoint ratelimit
   */
  readonly global: boolean
  /**
   * Discord internal error code. See error code reference
   */
  readonly code: number
  /**
   * Human-readable error message
   */
  readonly message: string
}

/**
 * A single error, either for an API response or a specific field.
 */
export interface Error {
  /**
   * Discord internal error code. See error code reference
   */
  readonly code: number
  /**
   * Human-readable error message
   */
  readonly message: string
}

export interface InnerErrors {
  /**
   * The list of errors for this field
   */
  readonly _errors: ReadonlyArray<Error>
}

export type ErrorDetails = Record<string, unknown> | InnerErrors

/**
 * A single error, either for an API response or a specific field.
 */
export interface ErrorResponse {
  readonly errors?: ErrorDetails | undefined
  /**
   * Discord internal error code. See error code reference
   */
  readonly code: number
  /**
   * Human-readable error message
   */
  readonly message: string
}

export interface ApplicationOAuth2InstallParams {
  readonly scopes?:
    | ReadonlyArray<"applications.commands" | "bot">
    | null
    | undefined
  readonly permissions?: number | null | undefined
}

export interface ApplicationFormPartial {
  readonly description?:
    | {
        readonly default: string
        readonly localizations?: Record<string, unknown> | null | undefined
      }
    | null
    | undefined
  readonly icon?: string | null | undefined
  readonly cover_image?: string | null | undefined
  readonly team_id?: SnowflakeType | null | undefined
  readonly flags?: number | null | undefined
  readonly interactions_endpoint_url?: string | null | undefined
  readonly explicit_content_filter?:
    | ApplicationExplicitContentFilterTypes
    | null
    | undefined
  readonly max_participants?: number | null | undefined
  readonly type?: ApplicationTypes | null | undefined
  readonly tags?: ReadonlyArray<string> | null | undefined
  readonly custom_install_url?: string | null | undefined
  readonly install_params?: ApplicationOAuth2InstallParams | null | undefined
  readonly role_connections_verification_url?: string | null | undefined
  readonly integration_types_config?: Record<string, unknown> | null | undefined
}

export const EmbeddedActivityLocationKind = {
  /**
   * guild channel
   */
  GUILD_CHANNEL: "gc",
  /**
   * private channel
   */
  PRIVATE_CHANNEL: "pc",
  /**
   * party
   */
  PARTY: "party",
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
  readonly location: GuildChannelLocation | PrivateChannelLocation
  readonly users: ReadonlyArray<SnowflakeType>
}

export interface UploadApplicationAttachmentRequest {
  readonly file: Blob
}

export interface ApplicationResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly icon?: string | null | undefined
  readonly description: string
  readonly type?: ApplicationTypes | null | undefined
  readonly cover_image?: string | undefined
  readonly primary_sku_id?: SnowflakeType | undefined
  readonly bot?: UserResponse | undefined
  readonly slug?: string | undefined
  readonly guild_id?: SnowflakeType | undefined
  readonly rpc_origins?: ReadonlyArray<string> | undefined
  readonly bot_public?: boolean | undefined
  readonly bot_require_code_grant?: boolean | undefined
  readonly terms_of_service_url?: string | undefined
  readonly privacy_policy_url?: string | undefined
  readonly custom_install_url?: string | undefined
  readonly install_params?: ApplicationOAuth2InstallParamsResponse | undefined
  readonly integration_types_config?: Record<string, unknown> | undefined
  readonly verify_key: string
  readonly flags: number
  readonly max_participants?: number | null | undefined
  readonly tags?: ReadonlyArray<string> | undefined
}

export interface AttachmentResponse {
  readonly id: SnowflakeType
  readonly filename: string
  readonly size: number
  readonly url: string
  readonly proxy_url: string
  readonly width?: number | undefined
  readonly height?: number | undefined
  readonly duration_secs?: number | undefined
  readonly waveform?: string | undefined
  readonly description?: string | undefined
  readonly content_type?: string | undefined
  readonly ephemeral?: boolean | undefined
  readonly title?: string | null | undefined
  readonly application?: ApplicationResponse | undefined
  readonly clip_created_at?: string | undefined
  readonly clip_participants?: ReadonlyArray<UserResponse> | undefined
}

export interface ActivitiesAttachmentResponse {
  readonly attachment: AttachmentResponse
}

export interface ListApplicationCommandsParams {
  readonly with_localizations?: boolean | undefined
}

export const ApplicationCommandType = {
  /**
   * Slash commands; a text-based command that shows up when a user types /
   */
  CHAT: 1,
  /**
   * A UI-based command that shows up when you right click or tap on a user
   */
  USER: 2,
  /**
   * A UI-based command that shows up when you right click or tap on a message
   */
  MESSAGE: 3,
  /**
   * A command that represents the primary way to use an application (e.g. launching an Activity)
   */
  PRIMARY_ENTRY_POINT: 4,
} as const
export type ApplicationCommandType =
  (typeof ApplicationCommandType)[keyof typeof ApplicationCommandType]

export const InteractionContextType = {
  /**
   * This command can be used within a Guild.
   */
  GUILD: 0,
  /**
   * This command can be used within a DM with this application's bot.
   */
  BOT_DM: 1,
  /**
   * This command can be used within DMs and Group DMs with users.
   */
  PRIVATE_CHANNEL: 2,
} as const
export type InteractionContextType =
  (typeof InteractionContextType)[keyof typeof InteractionContextType]

export const ApplicationIntegrationType = {
  /**
   * For Guild install.
   */
  GUILD_INSTALL: 0,
  /**
   * For User install.
   */
  USER_INSTALL: 1,
} as const
export type ApplicationIntegrationType =
  (typeof ApplicationIntegrationType)[keyof typeof ApplicationIntegrationType]

export const ApplicationCommandOptionType = {
  /**
   * A sub-action within a command or group
   */
  SUB_COMMAND: 1,
  /**
   * A group of subcommands
   */
  SUB_COMMAND_GROUP: 2,
  /**
   * A string option
   */
  STRING: 3,
  /**
   * An integer option. Any integer between -2^53 and 2^53 is a valid value
   */
  INTEGER: 4,
  /**
   * A boolean option
   */
  BOOLEAN: 5,
  /**
   * A snowflake option that represents a User
   */
  USER: 6,
  /**
   * A snowflake option that represents a Channel. Includes all channel types and categories
   */
  CHANNEL: 7,
  /**
   * A snowflake option that represents a Role
   */
  ROLE: 8,
  /**
   * A snowflake option that represents anything you can mention
   */
  MENTIONABLE: 9,
  /**
   * A number option. Any double between -2^53 and 2^53 is a valid value
   */
  NUMBER: 10,
  /**
   * An attachment option
   */
  ATTACHMENT: 11,
} as const
export type ApplicationCommandOptionType =
  (typeof ApplicationCommandOptionType)[keyof typeof ApplicationCommandOptionType]

export interface ApplicationCommandAttachmentOptionResponse {
  readonly type: 11
  readonly name: string
  readonly name_localized?: string | undefined
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localized?: string | undefined
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | undefined
}

export interface ApplicationCommandBooleanOptionResponse {
  readonly type: 5
  readonly name: string
  readonly name_localized?: string | undefined
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localized?: string | undefined
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | undefined
}

export const ChannelTypes = {
  /**
   * A direct message between users
   */
  DM: 1,
  /**
   * A direct message between multiple users
   */
  GROUP_DM: 3,
  /**
   * A text channel within a server
   */
  GUILD_TEXT: 0,
  /**
   * A voice channel within a server
   */
  GUILD_VOICE: 2,
  /**
   * An organizational category that contains up to 50 channels
   */
  GUILD_CATEGORY: 4,
  /**
   * A channel that users can follow and crosspost into their own server (formerly news channels)
   */
  GUILD_ANNOUNCEMENT: 5,
  /**
   * A temporary sub-channel within a GUILD_ANNOUNCEMENT channel
   */
  ANNOUNCEMENT_THREAD: 10,
  /**
   * A temporary sub-channel within a GUILD_TEXT or GUILD_THREADS_ONLY channel type set
   */
  PUBLIC_THREAD: 11,
  /**
   * A temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission
   */
  PRIVATE_THREAD: 12,
  /**
   * A voice channel for hosting events with an audience
   */
  GUILD_STAGE_VOICE: 13,
  /**
   * The channel in a hub containing the listed servers
   */
  GUILD_DIRECTORY: 14,
  /**
   * Channel that can only contain threads
   */
  GUILD_FORUM: 15,
} as const
export type ChannelTypes = (typeof ChannelTypes)[keyof typeof ChannelTypes]

export interface ApplicationCommandChannelOptionResponse {
  readonly type: 7
  readonly name: string
  readonly name_localized?: string | undefined
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localized?: string | undefined
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | undefined
  readonly channel_types?: ReadonlyArray<ChannelTypes> | undefined
}

export interface ApplicationCommandOptionIntegerChoiceResponse {
  readonly name: string
  readonly name_localized?: string | undefined
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly value: Int53Type
}

export interface ApplicationCommandIntegerOptionResponse {
  readonly type: 4
  readonly name: string
  readonly name_localized?: string | undefined
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localized?: string | undefined
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | undefined
  readonly autocomplete?: boolean | undefined
  readonly choices?:
    | ReadonlyArray<ApplicationCommandOptionIntegerChoiceResponse>
    | undefined
  readonly min_value?: Int53Type | undefined
  readonly max_value?: Int53Type | undefined
}

export interface ApplicationCommandMentionableOptionResponse {
  readonly type: 9
  readonly name: string
  readonly name_localized?: string | undefined
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localized?: string | undefined
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | undefined
}

export interface ApplicationCommandOptionNumberChoiceResponse {
  readonly name: string
  readonly name_localized?: string | undefined
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly value: number
}

export interface ApplicationCommandNumberOptionResponse {
  readonly type: 10
  readonly name: string
  readonly name_localized?: string | undefined
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localized?: string | undefined
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | undefined
  readonly autocomplete?: boolean | undefined
  readonly choices?:
    | ReadonlyArray<ApplicationCommandOptionNumberChoiceResponse>
    | undefined
  readonly min_value?: number | undefined
  readonly max_value?: number | undefined
}

export interface ApplicationCommandRoleOptionResponse {
  readonly type: 8
  readonly name: string
  readonly name_localized?: string | undefined
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localized?: string | undefined
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | undefined
}

export interface ApplicationCommandOptionStringChoiceResponse {
  readonly name: string
  readonly name_localized?: string | undefined
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly value: string
}

export interface ApplicationCommandStringOptionResponse {
  readonly type: 3
  readonly name: string
  readonly name_localized?: string | undefined
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localized?: string | undefined
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | undefined
  readonly autocomplete?: boolean | undefined
  readonly choices?:
    | ReadonlyArray<ApplicationCommandOptionStringChoiceResponse>
    | undefined
  readonly min_length?: number | undefined
  readonly max_length?: number | undefined
}

export interface ApplicationCommandUserOptionResponse {
  readonly type: 6
  readonly name: string
  readonly name_localized?: string | undefined
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localized?: string | undefined
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | undefined
}

export interface ApplicationCommandSubcommandOptionResponse {
  readonly type: 1
  readonly name: string
  readonly name_localized?: string | undefined
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localized?: string | undefined
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | undefined
  readonly options?:
    | ReadonlyArray<
        | ApplicationCommandAttachmentOptionResponse
        | ApplicationCommandBooleanOptionResponse
        | ApplicationCommandChannelOptionResponse
        | ApplicationCommandIntegerOptionResponse
        | ApplicationCommandMentionableOptionResponse
        | ApplicationCommandNumberOptionResponse
        | ApplicationCommandRoleOptionResponse
        | ApplicationCommandStringOptionResponse
        | ApplicationCommandUserOptionResponse
      >
    | undefined
}

export interface ApplicationCommandSubcommandGroupOptionResponse {
  readonly type: 2
  readonly name: string
  readonly name_localized?: string | undefined
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localized?: string | undefined
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | undefined
  readonly options?:
    | ReadonlyArray<ApplicationCommandSubcommandOptionResponse>
    | undefined
}

export interface ApplicationCommandResponse {
  readonly id: SnowflakeType
  readonly application_id: SnowflakeType
  readonly version: SnowflakeType
  readonly default_member_permissions?: string | null | undefined
  readonly type: ApplicationCommandType
  readonly name: string
  readonly name_localized?: string | undefined
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localized?: string | undefined
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly guild_id?: SnowflakeType | undefined
  readonly dm_permission?: boolean | undefined
  readonly contexts?: ReadonlyArray<InteractionContextType> | null | undefined
  readonly integration_types?:
    | ReadonlyArray<ApplicationIntegrationType>
    | undefined
  readonly options?:
    | ReadonlyArray<
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
      >
    | undefined
  readonly nsfw?: boolean | undefined
}

export type ListApplicationCommands200 =
  ReadonlyArray<ApplicationCommandResponse>

export interface ApplicationCommandAttachmentOption {
  readonly type: 11
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | null | undefined
}

export interface ApplicationCommandBooleanOption {
  readonly type: 5
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | null | undefined
}

export interface ApplicationCommandChannelOption {
  readonly type: 7
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | null | undefined
  readonly channel_types?: ReadonlyArray<ChannelTypes> | null | undefined
}

export interface ApplicationCommandOptionIntegerChoice {
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly value: Int53Type
}

export interface ApplicationCommandIntegerOption {
  readonly type: 4
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | null | undefined
  readonly autocomplete?: boolean | null | undefined
  readonly choices?:
    | ReadonlyArray<ApplicationCommandOptionIntegerChoice>
    | null
    | undefined
  readonly min_value?: Int53Type | null | undefined
  readonly max_value?: Int53Type | null | undefined
}

export interface ApplicationCommandMentionableOption {
  readonly type: 9
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | null | undefined
}

export interface ApplicationCommandOptionNumberChoice {
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly value: number
}

export interface ApplicationCommandNumberOption {
  readonly type: 10
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | null | undefined
  readonly autocomplete?: boolean | null | undefined
  readonly choices?:
    | ReadonlyArray<ApplicationCommandOptionNumberChoice>
    | null
    | undefined
  readonly min_value?: number | null | undefined
  readonly max_value?: number | null | undefined
}

export interface ApplicationCommandRoleOption {
  readonly type: 8
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | null | undefined
}

export interface ApplicationCommandOptionStringChoice {
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly value: string
}

export interface ApplicationCommandStringOption {
  readonly type: 3
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | null | undefined
  readonly autocomplete?: boolean | null | undefined
  readonly min_length?: number | null | undefined
  readonly max_length?: number | null | undefined
  readonly choices?:
    | ReadonlyArray<ApplicationCommandOptionStringChoice>
    | null
    | undefined
}

export interface ApplicationCommandUserOption {
  readonly type: 6
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | null | undefined
}

export interface ApplicationCommandSubcommandOption {
  readonly type: 1
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | null | undefined
  readonly options?:
    | ReadonlyArray<
        | ApplicationCommandAttachmentOption
        | ApplicationCommandBooleanOption
        | ApplicationCommandChannelOption
        | ApplicationCommandIntegerOption
        | ApplicationCommandMentionableOption
        | ApplicationCommandNumberOption
        | ApplicationCommandRoleOption
        | ApplicationCommandStringOption
        | ApplicationCommandUserOption
      >
    | null
    | undefined
}

export interface ApplicationCommandSubcommandGroupOption {
  readonly type: 2
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly required?: boolean | null | undefined
  readonly options?:
    | ReadonlyArray<ApplicationCommandSubcommandOption>
    | null
    | undefined
}

export type ApplicationCommandHandler = number

export interface ApplicationCommandUpdateRequest {
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description?: string | null | undefined
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly options?:
    | ReadonlyArray<
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
      >
    | null
    | undefined
  readonly default_member_permissions?: number | null | undefined
  readonly dm_permission?: boolean | null | undefined
  readonly contexts?: ReadonlyArray<InteractionContextType> | null | undefined
  readonly integration_types?:
    | ReadonlyArray<ApplicationIntegrationType>
    | null
    | undefined
  readonly handler?: ApplicationCommandHandler | null | undefined
  readonly type?: ApplicationCommandType | null | undefined
  readonly id?: SnowflakeType | null | undefined
}

export type BulkSetApplicationCommandsRequest =
  ReadonlyArray<ApplicationCommandUpdateRequest>

export type BulkSetApplicationCommands200 =
  ReadonlyArray<ApplicationCommandResponse>

export interface ApplicationCommandCreateRequest {
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description?: string | null | undefined
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly options?:
    | ReadonlyArray<
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
      >
    | null
    | undefined
  readonly default_member_permissions?: number | null | undefined
  readonly dm_permission?: boolean | null | undefined
  readonly contexts?: ReadonlyArray<InteractionContextType> | null | undefined
  readonly integration_types?:
    | ReadonlyArray<ApplicationIntegrationType>
    | null
    | undefined
  readonly handler?: ApplicationCommandHandler | null | undefined
  readonly type?: ApplicationCommandType | null | undefined
}

export interface ApplicationCommandPatchRequestPartial {
  readonly name?: string | undefined
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description?: string | null | undefined
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
  readonly options?:
    | ReadonlyArray<
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
      >
    | null
    | undefined
  readonly default_member_permissions?: number | null | undefined
  readonly dm_permission?: boolean | null | undefined
  readonly contexts?: ReadonlyArray<InteractionContextType> | null | undefined
  readonly integration_types?:
    | ReadonlyArray<ApplicationIntegrationType>
    | null
    | undefined
  readonly handler?: ApplicationCommandHandler | null | undefined
}

export interface EmojiResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly user?: UserResponse | undefined
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
  readonly name?: string | undefined
}

export interface GetEntitlementsParams {
  readonly user_id?: SnowflakeType | undefined
  readonly sku_ids?: string | ReadonlyArray<null | SnowflakeType> | undefined
  readonly guild_id?: SnowflakeType | undefined
  readonly before?: SnowflakeType | undefined
  readonly after?: SnowflakeType | undefined
  readonly limit?: number | undefined
  readonly exclude_ended?: boolean | undefined
  readonly exclude_deleted?: boolean | undefined
  readonly only_active?: boolean | undefined
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
  readonly guild_id?: SnowflakeType | null | undefined
  readonly deleted: boolean
  readonly starts_at?: string | null | undefined
  readonly ends_at?: string | null | undefined
  readonly type: EntitlementTypes
  readonly fulfilled_at?: string | null | undefined
  readonly fulfillment_status?:
    | EntitlementTenantFulfillmentStatusResponse
    | null
    | undefined
  readonly consumed?: boolean | null | undefined
  readonly gifter_user_id?: SnowflakeType | null | undefined
}

export type GetEntitlements200 = ReadonlyArray<null | EntitlementResponse>

export type EntitlementOwnerTypes = number

export interface CreateEntitlementRequestData {
  readonly sku_id: SnowflakeType
  readonly owner_id: SnowflakeType
  readonly owner_type: EntitlementOwnerTypes
}

export interface ListGuildApplicationCommandsParams {
  readonly with_localizations?: boolean | undefined
}

export type ListGuildApplicationCommands200 =
  ReadonlyArray<ApplicationCommandResponse>

export type BulkSetGuildApplicationCommandsRequest =
  ReadonlyArray<ApplicationCommandUpdateRequest>

export type BulkSetGuildApplicationCommands200 =
  ReadonlyArray<ApplicationCommandResponse>

export const ApplicationCommandPermissionType = {
  /**
   * This permission is for a role.
   */
  ROLE: 1,
  /**
   * This permission is for a user.
   */
  USER: 2,
  /**
   * This permission is for a channel.
   */
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
  readonly permissions?:
    | ReadonlyArray<ApplicationCommandPermission>
    | null
    | undefined
}

export const MetadataItemTypes = {
  /**
   * the metadata value (integer) is less than or equal to the guild's configured value (integer)
   */
  INTEGER_LESS_THAN_EQUAL: 1,
  /**
   * the metadata value (integer) is greater than or equal to the guild's configured value (integer)
   */
  INTEGER_GREATER_THAN_EQUAL: 2,
  /**
   * the metadata value (integer) is equal to the guild's configured value (integer)
   */
  INTEGER_EQUAL: 3,
  /**
   * the metadata value (integer) is not equal to the guild's configured value (integer)
   */
  INTEGER_NOT_EQUAL: 4,
  /**
   * the metadata value (ISO8601 string) is less than or equal to the guild's configured value (integer; days before current date)
   */
  DATETIME_LESS_THAN_EQUAL: 5,
  /**
   * the metadata value (ISO8601 string) is greater than or equal to the guild's configured value (integer; days before current date)
   */
  DATETIME_GREATER_THAN_EQUAL: 6,
  /**
   * the metadata value (integer) is equal to the guild's configured value (integer; 1)
   */
  BOOLEAN_EQUAL: 7,
  /**
   * the metadata value (integer) is not equal to the guild's configured value (integer; 1)
   */
  BOOLEAN_NOT_EQUAL: 8,
} as const
export type MetadataItemTypes =
  (typeof MetadataItemTypes)[keyof typeof MetadataItemTypes]

export interface ApplicationRoleConnectionsMetadataItemResponse {
  readonly type: MetadataItemTypes
  readonly key: string
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
}

export type GetApplicationRoleConnectionsMetadata200 =
  ReadonlyArray<ApplicationRoleConnectionsMetadataItemResponse>

export interface ApplicationRoleConnectionsMetadataItemRequest {
  readonly type: MetadataItemTypes
  readonly key: string
  readonly name: string
  readonly name_localizations?: Record<string, unknown> | null | undefined
  readonly description: string
  readonly description_localizations?:
    | Record<string, unknown>
    | null
    | undefined
}

export type UpdateApplicationRoleConnectionsMetadataRequest =
  ReadonlyArray<ApplicationRoleConnectionsMetadataItemRequest>

export type UpdateApplicationRoleConnectionsMetadata200 =
  ReadonlyArray<ApplicationRoleConnectionsMetadataItemResponse>

export const VideoQualityModes = {
  /**
   * Discord chooses the quality for optimal performance
   */
  AUTO: 1,
  /**
   * 720p
   */
  FULL: 2,
} as const
export type VideoQualityModes =
  (typeof VideoQualityModes)[keyof typeof VideoQualityModes]

export const ThreadAutoArchiveDuration = {
  /**
   * One hour
   */
  ONE_HOUR: 60,
  /**
   * One day
   */
  ONE_DAY: 1440,
  /**
   * Three days
   */
  THREE_DAY: 4320,
  /**
   * Seven days
   */
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
  readonly emoji_id?: SnowflakeType | null | undefined
  readonly emoji_name?: string | null | undefined
}

export interface DefaultReactionEmojiResponse {
  readonly emoji_id?: SnowflakeType | null | undefined
  readonly emoji_name?: string | null | undefined
}

export const ThreadSortOrder = {
  /**
   * Sort forum posts by activity
   */
  LATEST_ACTIVITY: 0,
  /**
   * Sort forum posts by creation time (from most recent to oldest)
   */
  CREATION_DATE: 1,
} as const
export type ThreadSortOrder =
  (typeof ThreadSortOrder)[keyof typeof ThreadSortOrder]

export const ForumLayout = {
  /**
   * No default has been set for forum channel
   */
  DEFAULT: 0,
  /**
   * Display posts as a list
   */
  LIST: 1,
  /**
   * Display posts as a collection of tiles
   */
  GRID: 2,
} as const
export type ForumLayout = (typeof ForumLayout)[keyof typeof ForumLayout]

export const ThreadSearchTagSetting = {
  /**
   * The thread tags must contain all tags in the search query
   */
  MATCH_ALL: "match_all",
  /**
   * The thread tags must contain at least one of tags in the search query
   */
  MATCH_SOME: "match_some",
} as const
export type ThreadSearchTagSetting =
  (typeof ThreadSearchTagSetting)[keyof typeof ThreadSearchTagSetting]

export interface GuildChannelResponse {
  readonly id: SnowflakeType
  readonly type: 0 | 2 | 4 | 5 | 13 | 14 | 15
  readonly last_message_id?: SnowflakeType | null | undefined
  readonly flags: number
  readonly last_pin_timestamp?: string | null | undefined
  readonly guild_id: SnowflakeType
  readonly name: string
  readonly parent_id?: SnowflakeType | null | undefined
  readonly rate_limit_per_user?: number | undefined
  readonly bitrate?: number | undefined
  readonly user_limit?: number | undefined
  readonly rtc_region?: string | null | undefined
  readonly video_quality_mode?: VideoQualityModes | undefined
  readonly permissions?: string | null | undefined
  readonly topic?: string | null | undefined
  readonly default_auto_archive_duration?: ThreadAutoArchiveDuration | undefined
  readonly default_thread_rate_limit_per_user?: number | undefined
  readonly position: number
  readonly permission_overwrites?:
    | ReadonlyArray<ChannelPermissionOverwriteResponse>
    | undefined
  readonly nsfw?: boolean | undefined
  readonly available_tags?: ReadonlyArray<ForumTagResponse> | undefined
  readonly default_reaction_emoji?:
    | DefaultReactionEmojiResponse
    | null
    | undefined
  readonly default_sort_order?: ThreadSortOrder | null | undefined
  readonly default_forum_layout?: ForumLayout | null | undefined
  readonly default_tag_setting?: ThreadSearchTagSetting | null | undefined
  readonly hd_streaming_until?: string | undefined
  readonly hd_streaming_buyer_id?: SnowflakeType | undefined
}

export interface PrivateChannelResponse {
  readonly id: SnowflakeType
  readonly type: 1
  readonly last_message_id?: SnowflakeType | null | undefined
  readonly flags: number
  readonly last_pin_timestamp?: string | null | undefined
  readonly recipients: ReadonlyArray<UserResponse>
}

export interface PrivateGroupChannelResponse {
  readonly id: SnowflakeType
  readonly type: 3
  readonly last_message_id?: SnowflakeType | null | undefined
  readonly flags: number
  readonly last_pin_timestamp?: string | null | undefined
  readonly recipients: ReadonlyArray<UserResponse>
  readonly name?: string | null | undefined
  readonly icon?: string | null | undefined
  readonly owner_id: SnowflakeType
  readonly managed?: boolean | undefined
  readonly application_id?: SnowflakeType | undefined
}

export interface ThreadMetadataResponse {
  readonly archived: boolean
  readonly archive_timestamp?: string | null | undefined
  readonly auto_archive_duration: ThreadAutoArchiveDuration
  readonly locked: boolean
  readonly create_timestamp?: string | undefined
  readonly invitable?: boolean | undefined
}

export interface GuildMemberResponse {
  readonly avatar?: string | null | undefined
  readonly avatar_decoration_data?:
    | UserAvatarDecorationResponse
    | null
    | undefined
  readonly banner?: string | null | undefined
  readonly communication_disabled_until?: string | null | undefined
  readonly flags: number
  readonly joined_at: string
  readonly nick?: string | null | undefined
  readonly pending: boolean
  readonly premium_since?: string | null | undefined
  readonly roles: ReadonlyArray<SnowflakeType>
  readonly collectibles?: UserCollectiblesResponse | null | undefined
  readonly user: UserResponse
  readonly mute: boolean
  readonly deaf: boolean
}

export interface ThreadMemberResponse {
  readonly id: SnowflakeType
  readonly user_id: SnowflakeType
  readonly join_timestamp: string
  readonly flags: number
  readonly member?: GuildMemberResponse | undefined
}

export interface ThreadResponse {
  readonly id: SnowflakeType
  readonly type: 10 | 11 | 12
  readonly last_message_id?: SnowflakeType | null | undefined
  readonly flags: number
  readonly last_pin_timestamp?: string | null | undefined
  readonly guild_id: SnowflakeType
  readonly name: string
  readonly parent_id?: SnowflakeType | null | undefined
  readonly rate_limit_per_user?: number | undefined
  readonly bitrate?: number | undefined
  readonly user_limit?: number | undefined
  readonly rtc_region?: string | null | undefined
  readonly video_quality_mode?: VideoQualityModes | undefined
  readonly permissions?: string | null | undefined
  readonly owner_id: SnowflakeType
  readonly thread_metadata: ThreadMetadataResponse
  readonly message_count: number
  readonly member_count: number
  readonly total_message_sent: number
  readonly applied_tags?: ReadonlyArray<SnowflakeType> | undefined
  readonly member?: ThreadMemberResponse | undefined
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
  readonly name?: string | null | undefined
}

export interface UpdateGroupDMRequestPartial {
  readonly name?: string | null | undefined
  readonly icon?: string | null | undefined
}

export interface ChannelPermissionOverwriteRequest {
  readonly id: SnowflakeType
  readonly type?: ChannelPermissionOverwrites | null | undefined
  readonly allow?: number | null | undefined
  readonly deny?: number | null | undefined
}

export interface UpdateDefaultReactionEmojiRequest {
  readonly emoji_id?: SnowflakeType | null | undefined
  readonly emoji_name?: string | null | undefined
}

export interface UpdateThreadTagRequest {
  readonly name: string
  readonly emoji_id?: SnowflakeType | null | undefined
  readonly emoji_name?: string | null | undefined
  readonly moderated?: boolean | null | undefined
  readonly id?: SnowflakeType | null | undefined
}

export interface UpdateGuildChannelRequestPartial {
  readonly type?: 0 | 2 | 4 | 5 | 13 | 14 | 15 | null | undefined
  readonly name?: string | undefined
  readonly position?: number | null | undefined
  readonly topic?: string | null | undefined
  readonly bitrate?: number | null | undefined
  readonly user_limit?: number | null | undefined
  readonly nsfw?: boolean | null | undefined
  readonly rate_limit_per_user?: number | null | undefined
  readonly parent_id?: SnowflakeType | null | undefined
  readonly permission_overwrites?:
    | ReadonlyArray<ChannelPermissionOverwriteRequest>
    | null
    | undefined
  readonly rtc_region?: string | null | undefined
  readonly video_quality_mode?: VideoQualityModes | null | undefined
  readonly default_auto_archive_duration?:
    | ThreadAutoArchiveDuration
    | null
    | undefined
  readonly default_reaction_emoji?:
    | UpdateDefaultReactionEmojiRequest
    | null
    | undefined
  readonly default_thread_rate_limit_per_user?: number | null | undefined
  readonly default_sort_order?: ThreadSortOrder | null | undefined
  readonly default_forum_layout?: ForumLayout | null | undefined
  readonly default_tag_setting?: ThreadSearchTagSetting | null | undefined
  readonly flags?: number | null | undefined
  readonly available_tags?:
    | ReadonlyArray<UpdateThreadTagRequest>
    | null
    | undefined
}

export interface UpdateThreadRequestPartial {
  readonly name?: string | null | undefined
  readonly archived?: boolean | null | undefined
  readonly locked?: boolean | null | undefined
  readonly invitable?: boolean | null | undefined
  readonly auto_archive_duration?: ThreadAutoArchiveDuration | null | undefined
  readonly rate_limit_per_user?: number | null | undefined
  readonly flags?: number | null | undefined
  readonly applied_tags?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly bitrate?: number | null | undefined
  readonly user_limit?: number | null | undefined
  readonly rtc_region?: string | null | undefined
  readonly video_quality_mode?: VideoQualityModes | null | undefined
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
  readonly name?: string | null | undefined
  readonly icon?: string | undefined
  readonly recipients?:
    | ReadonlyArray<InviteChannelRecipientResponse>
    | undefined
}

export interface FriendInviteResponse {
  readonly type: 2
  readonly code: string
  readonly inviter?: UserResponse | undefined
  readonly max_age?: number | undefined
  readonly created_at?: string | undefined
  readonly expires_at?: string | null | undefined
  readonly friends_count?: number | undefined
  readonly channel?: InviteChannelResponse | null | undefined
  readonly is_contact?: boolean | undefined
  readonly uses?: number | undefined
  readonly max_uses?: number | undefined
  readonly flags?: number | undefined
}

export interface GroupDMInviteResponse {
  readonly type: 1
  readonly code: string
  readonly inviter?: UserResponse | undefined
  readonly max_age?: number | undefined
  readonly created_at?: string | undefined
  readonly expires_at?: string | null | undefined
  readonly channel: InviteChannelResponse
  readonly approximate_member_count?: number | null | undefined
}

export const GuildFeatures = {
  /**
   * guild has access to set an animated guild banner image
   */
  ANIMATED_BANNER: "ANIMATED_BANNER",
  /**
   * guild has access to set an animated guild icon
   */
  ANIMATED_ICON: "ANIMATED_ICON",
  /**
   * guild is using the old permissions configuration behavior
   */
  APPLICATION_COMMAND_PERMISSIONS_V2: "APPLICATION_COMMAND_PERMISSIONS_V2",
  /**
   * guild has set up auto moderation rules
   */
  AUTO_MODERATION: "AUTO_MODERATION",
  /**
   * guild has access to set a guild banner image
   */
  BANNER: "BANNER",
  /**
   * guild can enable welcome screen, Membership Screening, stage channels and discovery, and             receives community updates
   */
  COMMUNITY: "COMMUNITY",
  /**
   * guild has enabled monetization
   */
  CREATOR_MONETIZABLE_PROVISIONAL: "CREATOR_MONETIZABLE_PROVISIONAL",
  /**
   * guild has enabled the role subscription promo page
   */
  CREATOR_STORE_PAGE: "CREATOR_STORE_PAGE",
  /**
   * guild has been set as a support server on the App Directory
   */
  DEVELOPER_SUPPORT_SERVER: "DEVELOPER_SUPPORT_SERVER",
  /**
   * guild is able to be discovered in the directory
   */
  DISCOVERABLE: "DISCOVERABLE",
  /**
   * guild is able to be featured in the directory
   */
  FEATURABLE: "FEATURABLE",
  /**
   * guild has paused invites, preventing new users from joining
   */
  INVITES_DISABLED: "INVITES_DISABLED",
  /**
   * guild has access to set an invite splash background
   */
  INVITE_SPLASH: "INVITE_SPLASH",
  /**
   * guild has enabled Membership Screening
   */
  MEMBER_VERIFICATION_GATE_ENABLED: "MEMBER_VERIFICATION_GATE_ENABLED",
  /**
   * guild has increased custom sticker slots
   */
  MORE_STICKERS: "MORE_STICKERS",
  /**
   * guild has access to create announcement channels
   */
  NEWS: "NEWS",
  /**
   * guild is partnered
   */
  PARTNERED: "PARTNERED",
  /**
   * guild can be previewed before joining via Membership Screening or the directory
   */
  PREVIEW_ENABLED: "PREVIEW_ENABLED",
  /**
   * guild has disabled activity alerts in the configured safety alerts channel
   */
  RAID_ALERTS_DISABLED: "RAID_ALERTS_DISABLED",
  /**
   * guild is able to set role icons
   */
  ROLE_ICONS: "ROLE_ICONS",
  /**
   * guild has role subscriptions that can be purchased
   */
  ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE:
    "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE",
  /**
   * guild has enabled role subscriptions
   */
  ROLE_SUBSCRIPTIONS_ENABLED: "ROLE_SUBSCRIPTIONS_ENABLED",
  /**
   * guild has enabled ticketed events
   */
  TICKETED_EVENTS_ENABLED: "TICKETED_EVENTS_ENABLED",
  /**
   * guild has access to set a vanity URL
   */
  VANITY_URL: "VANITY_URL",
  /**
   * guild is verified
   */
  VERIFIED: "VERIFIED",
  /**
   * guild has access to set 384kbps bitrate in voice (previously VIP voice servers)
   */
  VIP_REGIONS: "VIP_REGIONS",
  /**
   * guild has enabled the welcome screen
   */
  WELCOME_SCREEN_ENABLED: "WELCOME_SCREEN_ENABLED",
} as const
export type GuildFeatures = (typeof GuildFeatures)[keyof typeof GuildFeatures]

export const VerificationLevels = {
  /**
   * unrestricted
   */
  NONE: 0,
  /**
   * must have verified email on account
   */
  LOW: 1,
  /**
   * must be registered on Discord for longer than 5 minutes
   */
  MEDIUM: 2,
  /**
   * must be a member of the server for longer than 10 minutes
   */
  HIGH: 3,
  /**
   * must have a verified phone number
   */
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
  readonly splash?: string | null | undefined
  readonly banner?: string | null | undefined
  readonly description?: string | null | undefined
  readonly icon?: string | null | undefined
  readonly features: ReadonlyArray<GuildFeatures>
  readonly verification_level?: VerificationLevels | null | undefined
  readonly vanity_url_code?: string | null | undefined
  readonly nsfw_level?: GuildNSFWContentLevel | null | undefined
  readonly nsfw?: boolean | null | undefined
  readonly premium_subscription_count: number
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
  readonly icon?: string | null | undefined
  readonly description: string
  readonly type?: ApplicationTypes | null | undefined
  readonly cover_image?: string | undefined
  readonly primary_sku_id?: SnowflakeType | undefined
  readonly bot?: UserResponse | undefined
  readonly slug?: string | undefined
  readonly guild_id?: SnowflakeType | undefined
  readonly rpc_origins?: ReadonlyArray<string> | undefined
  readonly bot_public?: boolean | undefined
  readonly bot_require_code_grant?: boolean | undefined
  readonly terms_of_service_url?: string | undefined
  readonly privacy_policy_url?: string | undefined
  readonly custom_install_url?: string | undefined
  readonly install_params?: ApplicationOAuth2InstallParamsResponse | undefined
  readonly integration_types_config?: Record<string, unknown> | undefined
  readonly verify_key: string
  readonly flags: number
  readonly max_participants?: number | null | undefined
  readonly tags?: ReadonlyArray<string> | undefined
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
  readonly user?: UserResponse | undefined
  readonly member?: GuildMemberResponse | undefined
}

export interface ScheduledEventResponse {
  readonly id: SnowflakeType
  readonly guild_id: SnowflakeType
  readonly name: string
  readonly description?: string | null | undefined
  readonly channel_id?: SnowflakeType | null | undefined
  readonly creator_id?: SnowflakeType | null | undefined
  readonly creator?: UserResponse | undefined
  readonly image?: string | null | undefined
  readonly scheduled_start_time: string
  readonly scheduled_end_time?: string | null | undefined
  readonly status: GuildScheduledEventStatuses
  readonly entity_type: GuildScheduledEventEntityTypes
  readonly entity_id?: SnowflakeType | null | undefined
  readonly user_count?: number | undefined
  readonly privacy_level: GuildScheduledEventPrivacyLevels
  readonly user_rsvp?: ScheduledEventUserResponse | null | undefined
}

export interface GuildInviteResponse {
  readonly type: 0
  readonly code: string
  readonly inviter?: UserResponse | undefined
  readonly max_age?: number | undefined
  readonly created_at?: string | undefined
  readonly expires_at?: string | null | undefined
  readonly is_contact?: boolean | undefined
  readonly flags?: number | undefined
  readonly guild: InviteGuildResponse
  readonly guild_id: SnowflakeType
  readonly channel: InviteChannelResponse
  readonly target_type?: InviteTargetTypes | undefined
  readonly target_user?: UserResponse | undefined
  readonly target_application?: InviteApplicationResponse | undefined
  readonly guild_scheduled_event?: ScheduledEventResponse | undefined
  readonly uses?: number | undefined
  readonly max_uses?: number | undefined
  readonly temporary?: boolean | undefined
  readonly approximate_member_count?: number | null | undefined
  readonly approximate_presence_count?: number | null | undefined
  readonly is_nickname_changeable?: boolean | undefined
}

export type ListChannelInvites200 = ReadonlyArray<
  FriendInviteResponse | GroupDMInviteResponse | GuildInviteResponse | null
>

export interface CreateGroupDMInviteRequest {
  readonly max_age?: number | null | undefined
}

export interface CreateGuildInviteRequest {
  readonly max_age?: number | null | undefined
  readonly temporary?: boolean | null | undefined
  readonly max_uses?: number | null | undefined
  readonly unique?: boolean | null | undefined
  readonly target_user_id?: SnowflakeType | null | undefined
  readonly target_application_id?: SnowflakeType | null | undefined
  readonly target_type?: 1 | 2 | null | undefined
}

export type CreateChannelInviteRequest =
  | CreateGroupDMInviteRequest
  | CreateGuildInviteRequest

export type CreateChannelInvite200 =
  | FriendInviteResponse
  | GroupDMInviteResponse
  | GuildInviteResponse

export interface ListMessagesParams {
  readonly around?: SnowflakeType | undefined
  readonly before?: SnowflakeType | undefined
  readonly after?: SnowflakeType | undefined
  readonly limit?: number | undefined
}

export const MessageType = {
  DEFAULT: 0,
  RECIPIENT_ADD: 1,
  RECIPIENT_REMOVE: 2,
  CALL: 3,
  CHANNEL_NAME_CHANGE: 4,
  CHANNEL_ICON_CHANGE: 5,
  CHANNEL_PINNED_MESSAGE: 6,
  USER_JOIN: 7,
  GUILD_BOOST: 8,
  GUILD_BOOST_TIER_1: 9,
  GUILD_BOOST_TIER_2: 10,
  GUILD_BOOST_TIER_3: 11,
  CHANNEL_FOLLOW_ADD: 12,
  GUILD_DISCOVERY_DISQUALIFIED: 14,
  GUILD_DISCOVERY_REQUALIFIED: 15,
  GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING: 16,
  GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING: 17,
  THREAD_CREATED: 18,
  REPLY: 19,
  CHAT_INPUT_COMMAND: 20,
  THREAD_STARTER_MESSAGE: 21,
  GUILD_INVITE_REMINDER: 22,
  CONTEXT_MENU_COMMAND: 23,
  AUTO_MODERATION_ACTION: 24,
  ROLE_SUBSCRIPTION_PURCHASE: 25,
  INTERACTION_PREMIUM_UPSELL: 26,
  STAGE_START: 27,
  STAGE_END: 28,
  STAGE_SPEAKER: 29,
  STAGE_TOPIC: 31,
  GUILD_APPLICATION_PREMIUM_SUBSCRIPTION: 32,
  GUILD_INCIDENT_ALERT_MODE_ENABLED: 36,
  GUILD_INCIDENT_ALERT_MODE_DISABLED: 37,
  GUILD_INCIDENT_REPORT_RAID: 38,
  GUILD_INCIDENT_REPORT_FALSE_ALARM: 39,
  POLL_RESULT: 46,
  HD_STREAMING_UPGRADED: 55,
} as const
export type MessageType = (typeof MessageType)[keyof typeof MessageType]

export interface MessageAttachmentResponse {
  readonly id: SnowflakeType
  readonly filename: string
  readonly size: number
  readonly url: string
  readonly proxy_url: string
  readonly width?: number | undefined
  readonly height?: number | undefined
  readonly duration_secs?: number | undefined
  readonly waveform?: string | undefined
  readonly description?: string | undefined
  readonly content_type?: string | undefined
  readonly ephemeral?: boolean | undefined
  readonly title?: string | null | undefined
  readonly application?: ApplicationResponse | undefined
  readonly clip_created_at?: string | undefined
  readonly clip_participants?: ReadonlyArray<UserResponse> | undefined
}

export interface MessageEmbedFieldResponse {
  readonly name: string
  readonly value: string
  readonly inline: boolean
}

export interface MessageEmbedAuthorResponse {
  readonly name: string
  readonly url?: string | undefined
  readonly icon_url?: string | undefined
  readonly proxy_icon_url?: string | undefined
}

export interface MessageEmbedProviderResponse {
  readonly name: string
  readonly url?: string | undefined
}

export type UInt32Type = number

export interface MessageEmbedImageResponse {
  readonly url?: string | undefined
  readonly proxy_url?: string | undefined
  readonly width?: UInt32Type | undefined
  readonly height?: UInt32Type | undefined
  readonly content_type?: string | undefined
  readonly placeholder?: string | undefined
  readonly placeholder_version?: UInt32Type | undefined
  readonly description?: string | undefined
  readonly flags?: UInt32Type | undefined
}

export interface MessageEmbedVideoResponse {
  readonly url?: string | undefined
  readonly proxy_url?: string | undefined
  readonly width?: UInt32Type | undefined
  readonly height?: UInt32Type | undefined
  readonly content_type?: string | undefined
  readonly placeholder?: string | undefined
  readonly placeholder_version?: UInt32Type | undefined
  readonly description?: string | undefined
  readonly flags?: UInt32Type | undefined
}

export interface MessageEmbedFooterResponse {
  readonly text: string
  readonly icon_url?: string | undefined
  readonly proxy_icon_url?: string | undefined
}

export interface MessageEmbedResponse {
  readonly type: string
  readonly url?: string | undefined
  readonly title?: string | undefined
  readonly description?: string | undefined
  readonly color?: number | undefined
  readonly timestamp?: string | undefined
  readonly fields?: ReadonlyArray<MessageEmbedFieldResponse> | undefined
  readonly author?: MessageEmbedAuthorResponse | undefined
  readonly provider?: MessageEmbedProviderResponse | undefined
  readonly image?: MessageEmbedImageResponse | undefined
  readonly thumbnail?: MessageEmbedImageResponse | undefined
  readonly video?: MessageEmbedVideoResponse | undefined
  readonly footer?: MessageEmbedFooterResponse | undefined
}

export const MessageComponentTypes = {
  /**
   * Container for other components
   */
  ACTION_ROW: 1,
  /**
   * Button object
   */
  BUTTON: 2,
  /**
   * Select menu for picking from defined text options
   */
  STRING_SELECT: 3,
  /**
   * Text input object
   */
  TEXT_INPUT: 4,
  /**
   * Select menu for users
   */
  USER_SELECT: 5,
  /**
   * Select menu for roles
   */
  ROLE_SELECT: 6,
  /**
   * Select menu for mentionables (users and roles)
   */
  MENTIONABLE_SELECT: 7,
  /**
   * Select menu for channels
   */
  CHANNEL_SELECT: 8,
  /**
   * Section component
   */
  SECTION: 9,
  /**
   * Text component
   */
  TEXT_DISPLAY: 10,
  /**
   * Thumbnail component
   */
  THUMBNAIL: 11,
  /**
   * Media gallery component
   */
  MEDIA_GALLERY: 12,
  /**
   * File component
   */
  FILE: 13,
  /**
   * Separator component
   */
  SEPARATOR: 14,
  /**
   * Container component
   */
  CONTAINER: 17,
  /**
   * Label component
   */
  LABEL: 18,
  /**
   * File upload component
   */
  FILE_UPLOAD: 19,
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
  readonly id?: SnowflakeType | undefined
  readonly name: string
  readonly animated?: boolean | undefined
}

export interface ButtonComponentResponse {
  readonly type: 2
  readonly id: number
  readonly custom_id?: string | undefined
  readonly style: ButtonStyleTypes
  readonly label?: string | undefined
  readonly disabled?: boolean | undefined
  readonly emoji?: ComponentEmojiResponse | undefined
  readonly url?: string | null | undefined
  readonly sku_id?: SnowflakeType | undefined
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
  readonly placeholder?: string | undefined
  readonly min_values?: number | null | undefined
  readonly max_values?: number | null | undefined
  readonly disabled?: boolean | undefined
  readonly channel_types?: ReadonlyArray<ChannelTypes> | undefined
  readonly default_values?:
    | ReadonlyArray<ChannelSelectDefaultValueResponse>
    | undefined
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
  readonly placeholder?: string | undefined
  readonly min_values?: number | null | undefined
  readonly max_values?: number | null | undefined
  readonly disabled?: boolean | undefined
  readonly default_values?:
    | ReadonlyArray<
        RoleSelectDefaultValueResponse | UserSelectDefaultValueResponse
      >
    | undefined
}

export interface RoleSelectComponentResponse {
  readonly type: 6
  readonly id: number
  readonly custom_id: string
  readonly placeholder?: string | undefined
  readonly min_values?: number | null | undefined
  readonly max_values?: number | null | undefined
  readonly disabled?: boolean | undefined
  readonly default_values?:
    | ReadonlyArray<RoleSelectDefaultValueResponse>
    | undefined
}

export interface StringSelectOptionResponse {
  readonly label: string
  readonly value: string
  readonly description?: string | undefined
  readonly emoji?: ComponentEmojiResponse | undefined
  readonly default?: boolean | undefined
}

export interface StringSelectComponentResponse {
  readonly type: 3
  readonly id: number
  readonly custom_id: string
  readonly placeholder?: string | undefined
  readonly min_values?: number | null | undefined
  readonly max_values?: number | null | undefined
  readonly disabled?: boolean | undefined
  readonly options: ReadonlyArray<StringSelectOptionResponse>
}

export const TextInputStyleTypes = {
  /**
   * Single-line input
   */
  SHORT: 1,
  /**
   * Multi-line input
   */
  PARAGRAPH: 2,
} as const
export type TextInputStyleTypes =
  (typeof TextInputStyleTypes)[keyof typeof TextInputStyleTypes]

export interface TextInputComponentResponse {
  readonly type: 4
  readonly id: number
  readonly custom_id: string
  readonly style: TextInputStyleTypes
  readonly label?: string | null | undefined
  readonly value?: string | undefined
  readonly placeholder?: string | undefined
  readonly required?: boolean | undefined
  readonly min_length?: number | null | undefined
  readonly max_length?: number | null | undefined
}

export interface UserSelectComponentResponse {
  readonly type: 5
  readonly id: number
  readonly custom_id: string
  readonly placeholder?: string | undefined
  readonly min_values?: number | null | undefined
  readonly max_values?: number | null | undefined
  readonly disabled?: boolean | undefined
  readonly default_values?:
    | ReadonlyArray<UserSelectDefaultValueResponse>
    | undefined
}

export interface ActionRowComponentResponse {
  readonly type: 1
  readonly id: number
  readonly components: ReadonlyArray<
    | ButtonComponentResponse
    | ChannelSelectComponentResponse
    | MentionableSelectComponentResponse
    | RoleSelectComponentResponse
    | StringSelectComponentResponse
    | TextInputComponentResponse
    | UserSelectComponentResponse
  >
}

export interface UnfurledMediaResponse {
  readonly id: SnowflakeType
  readonly url: string
  readonly proxy_url: string
  readonly width?: number | null | undefined
  readonly height?: number | null | undefined
  readonly content_type?: string | null | undefined
  readonly attachment_id?: SnowflakeType | undefined
}

export interface FileComponentResponse {
  readonly type: 13
  readonly id: number
  readonly file: UnfurledMediaResponse
  readonly name?: string | null | undefined
  readonly size?: number | null | undefined
  readonly spoiler: boolean
}

export interface MediaGalleryItemResponse {
  readonly media: UnfurledMediaResponse
  readonly description?: string | null | undefined
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
  readonly description?: string | null | undefined
  readonly spoiler: boolean
}

export interface SectionComponentResponse {
  readonly type: 9
  readonly id: number
  readonly components: ReadonlyArray<TextDisplayComponentResponse>
  readonly accessory: ButtonComponentResponse | ThumbnailComponentResponse
}

export const MessageComponentSeparatorSpacingSize = {
  /**
   * Small spacing
   */
  SMALL: 1,
  /**
   * Large spacing
   */
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
  readonly accent_color?: number | null | undefined
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

export const StickerTypes = {
  /**
   * an official sticker in a pack, part of Nitro or in a removed purchasable pack
   */
  STANDARD: 1,
  /**
   * a sticker uploaded to a guild for the guild's members
   */
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
  readonly format_type?: StickerFormatTypes | null | undefined
  readonly description?: string | null | undefined
  readonly available: boolean
  readonly guild_id: SnowflakeType
  readonly user?: UserResponse | undefined
}

export interface StandardStickerResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly tags: string
  readonly type: 1
  readonly format_type?: StickerFormatTypes | null | undefined
  readonly description?: string | null | undefined
  readonly pack_id: SnowflakeType
  readonly sort_value: number
}

export interface MessageStickerItemResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly format_type: StickerFormatTypes
}

export interface MessageCallResponse {
  readonly ended_timestamp?: string | null | undefined
  readonly participants: ReadonlyArray<SnowflakeType>
}

export interface MessageActivityResponse {}

export interface BasicApplicationResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly icon?: string | null | undefined
  readonly description: string
  readonly type?: ApplicationTypes | null | undefined
  readonly cover_image?: string | undefined
  readonly primary_sku_id?: SnowflakeType | undefined
  readonly bot?: UserResponse | undefined
}

export const InteractionTypes = {
  /**
   * Sent by Discord to validate your application's interaction handler
   */
  PING: 1,
  /**
   * Sent when a user uses an application command
   */
  APPLICATION_COMMAND: 2,
  /**
   * Sent when a user interacts with a message component previously sent by your application
   */
  MESSAGE_COMPONENT: 3,
  /**
   * Sent when a user is filling in an autocomplete option in a chat command
   */
  APPLICATION_COMMAND_AUTOCOMPLETE: 4,
  /**
   * Sent when a user submits a modal previously sent by your application
   */
  MODAL_SUBMIT: 5,
} as const
export type InteractionTypes =
  (typeof InteractionTypes)[keyof typeof InteractionTypes]

export interface MessageInteractionResponse {
  readonly id: SnowflakeType
  readonly type: InteractionTypes
  readonly name: string
  readonly user?: UserResponse | undefined
  readonly name_localized?: string | undefined
}

export type MessageReferenceType = 0

export interface MessageReferenceResponse {
  readonly type: MessageReferenceType
  readonly channel_id: SnowflakeType
  readonly message_id?: SnowflakeType | undefined
  readonly guild_id?: SnowflakeType | undefined
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
  readonly guild_product_purchase?: GuildProductPurchaseResponse | undefined
}

export interface ResolvedObjectsResponse {
  readonly users?: Record<string, unknown> | null | undefined
  readonly members?: Record<string, unknown> | null | undefined
  readonly channels?: Record<string, unknown> | null | undefined
  readonly roles?: Record<string, unknown> | null | undefined
}

export interface MessageReactionEmojiResponse {
  readonly id?: SnowflakeType | null | undefined
  readonly name?: string | null | undefined
  readonly animated?: boolean | undefined
}

export interface PollMediaResponse {
  readonly text?: string | undefined
  readonly emoji?: MessageReactionEmojiResponse | undefined
}

export interface PollAnswerResponse {
  readonly answer_id: number
  readonly poll_media: PollMediaResponse
}

export type PollLayoutTypes = number

export interface PollResultsEntryResponse {
  readonly id: number
  readonly count: number
  readonly me_voted: boolean
}

export interface PollResultsResponse {
  readonly answer_counts: ReadonlyArray<PollResultsEntryResponse>
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

export const MessageShareCustomUserThemeBaseTheme = {
  /**
   * No base theme
   */
  UNSET: 0,
  /**
   * Dark base theme
   */
  DARK: 1,
  /**
   * Light base theme
   */
  LIGHT: 2,
  /**
   * Darker base theme
   */
  DARKER: 3,
  /**
   * Midnight base theme
   */
  MIDNIGHT: 4,
} as const
export type MessageShareCustomUserThemeBaseTheme =
  (typeof MessageShareCustomUserThemeBaseTheme)[keyof typeof MessageShareCustomUserThemeBaseTheme]

export interface CustomClientThemeResponse {
  readonly colors: ReadonlyArray<string>
  readonly gradient_angle: number
  readonly base_mix: number
  readonly base_theme: MessageShareCustomUserThemeBaseTheme
}

export interface ApplicationCommandInteractionMetadataResponse {
  readonly id: SnowflakeType
  readonly type: 2
  readonly user?: UserResponse | undefined
  readonly authorizing_integration_owners: Record<string, unknown>
  readonly original_response_message_id?: SnowflakeType | undefined
  readonly target_user?: UserResponse | undefined
  readonly target_message_id?: SnowflakeType | undefined
}

export interface MessageComponentInteractionMetadataResponse {
  readonly id: SnowflakeType
  readonly type: 3
  readonly user?: UserResponse | undefined
  readonly authorizing_integration_owners: Record<string, unknown>
  readonly original_response_message_id?: SnowflakeType | undefined
  readonly interacted_message_id: SnowflakeType
}

export interface ModalSubmitInteractionMetadataResponse {
  readonly id: SnowflakeType
  readonly type: 5
  readonly user?: UserResponse | undefined
  readonly authorizing_integration_owners: Record<string, unknown>
  readonly original_response_message_id?: SnowflakeType | undefined
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
  readonly edited_timestamp?: string | null | undefined
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
  readonly stickers?:
    | ReadonlyArray<GuildStickerResponse | StandardStickerResponse>
    | undefined
  readonly sticker_items?: ReadonlyArray<MessageStickerItemResponse> | undefined
}

export interface MessageSnapshotResponse {
  readonly message: MinimalContentMessageResponse
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
  readonly edited_timestamp?: string | null | undefined
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
  readonly stickers?:
    | ReadonlyArray<GuildStickerResponse | StandardStickerResponse>
    | undefined
  readonly sticker_items?: ReadonlyArray<MessageStickerItemResponse> | undefined
  readonly id: SnowflakeType
  readonly channel_id: SnowflakeType
  readonly author: UserResponse
  readonly pinned: boolean
  readonly mention_everyone: boolean
  readonly tts: boolean
  readonly call?: MessageCallResponse | undefined
  readonly activity?: MessageActivityResponse | undefined
  readonly application?: BasicApplicationResponse | undefined
  readonly application_id?: SnowflakeType | undefined
  readonly interaction?: MessageInteractionResponse | undefined
  readonly nonce?: number | string | null | undefined
  readonly webhook_id?: SnowflakeType | undefined
  readonly message_reference?: MessageReferenceResponse | undefined
  readonly thread?: ThreadResponse | undefined
  readonly mention_channels?:
    | ReadonlyArray<null | MessageMentionChannelResponse>
    | undefined
  readonly role_subscription_data?:
    | MessageRoleSubscriptionDataResponse
    | undefined
  readonly purchase_notification?: PurchaseNotificationResponse | undefined
  readonly position?: number | undefined
  readonly resolved?: ResolvedObjectsResponse | undefined
  readonly poll?: PollResponse | undefined
  readonly shared_client_theme?: CustomClientThemeResponse | null | undefined
  readonly interaction_metadata?:
    | ApplicationCommandInteractionMetadataResponse
    | MessageComponentInteractionMetadataResponse
    | ModalSubmitInteractionMetadataResponse
    | undefined
  readonly message_snapshots?:
    | ReadonlyArray<MessageSnapshotResponse>
    | undefined
}

export interface MessageResponse {
  readonly type: MessageType
  readonly content: string
  readonly mentions: ReadonlyArray<UserResponse>
  readonly mention_roles: ReadonlyArray<SnowflakeType>
  readonly attachments: ReadonlyArray<MessageAttachmentResponse>
  readonly embeds: ReadonlyArray<MessageEmbedResponse>
  readonly timestamp: string
  readonly edited_timestamp?: string | null | undefined
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
  readonly stickers?:
    | ReadonlyArray<GuildStickerResponse | StandardStickerResponse>
    | undefined
  readonly sticker_items?: ReadonlyArray<MessageStickerItemResponse> | undefined
  readonly id: SnowflakeType
  readonly channel_id: SnowflakeType
  readonly author: UserResponse
  readonly pinned: boolean
  readonly mention_everyone: boolean
  readonly tts: boolean
  readonly call?: MessageCallResponse | undefined
  readonly activity?: MessageActivityResponse | undefined
  readonly application?: BasicApplicationResponse | undefined
  readonly application_id?: SnowflakeType | undefined
  readonly interaction?: MessageInteractionResponse | undefined
  readonly nonce?: number | string | null | undefined
  readonly webhook_id?: SnowflakeType | undefined
  readonly message_reference?: MessageReferenceResponse | undefined
  readonly thread?: ThreadResponse | undefined
  readonly mention_channels?:
    | ReadonlyArray<null | MessageMentionChannelResponse>
    | undefined
  readonly role_subscription_data?:
    | MessageRoleSubscriptionDataResponse
    | undefined
  readonly purchase_notification?: PurchaseNotificationResponse | undefined
  readonly position?: number | undefined
  readonly resolved?: ResolvedObjectsResponse | undefined
  readonly poll?: PollResponse | undefined
  readonly shared_client_theme?: CustomClientThemeResponse | null | undefined
  readonly interaction_metadata?:
    | ApplicationCommandInteractionMetadataResponse
    | MessageComponentInteractionMetadataResponse
    | ModalSubmitInteractionMetadataResponse
    | undefined
  readonly message_snapshots?:
    | ReadonlyArray<MessageSnapshotResponse>
    | undefined
  readonly reactions?: ReadonlyArray<MessageReactionResponse> | undefined
  readonly referenced_message?: BasicMessageResponse | null | undefined
}

export type ListMessages200 = ReadonlyArray<MessageResponse>

export interface RichEmbedAuthor {
  readonly name?: string | null | undefined
  readonly url?: string | null | undefined
  readonly icon_url?: string | null | undefined
}

export interface RichEmbedImage {
  readonly url?: string | null | undefined
  readonly width?: number | null | undefined
  readonly height?: number | null | undefined
  readonly placeholder?: string | null | undefined
  readonly placeholder_version?: number | null | undefined
  readonly is_animated?: boolean | null | undefined
  readonly description?: string | null | undefined
}

export interface RichEmbedThumbnail {
  readonly url?: string | null | undefined
  readonly width?: number | null | undefined
  readonly height?: number | null | undefined
  readonly placeholder?: string | null | undefined
  readonly placeholder_version?: number | null | undefined
  readonly is_animated?: boolean | null | undefined
  readonly description?: string | null | undefined
}

export interface RichEmbedFooter {
  readonly text?: string | null | undefined
  readonly icon_url?: string | null | undefined
}

export interface RichEmbedField {
  readonly name: string
  readonly value: string
  readonly inline?: boolean | null | undefined
}

export interface RichEmbedProvider {
  readonly name?: string | null | undefined
  readonly url?: string | null | undefined
}

export interface RichEmbedVideo {
  readonly url?: string | null | undefined
  readonly width?: number | null | undefined
  readonly height?: number | null | undefined
  readonly placeholder?: string | null | undefined
  readonly placeholder_version?: number | null | undefined
  readonly is_animated?: boolean | null | undefined
  readonly description?: string | null | undefined
}

export interface RichEmbed {
  readonly type?: string | null | undefined
  readonly url?: string | null | undefined
  readonly title?: string | null | undefined
  readonly color?: number | null | undefined
  readonly timestamp?: string | null | undefined
  readonly description?: string | null | undefined
  readonly author?: RichEmbedAuthor | null | undefined
  readonly image?: RichEmbedImage | null | undefined
  readonly thumbnail?: RichEmbedThumbnail | null | undefined
  readonly footer?: RichEmbedFooter | null | undefined
  readonly fields?: ReadonlyArray<RichEmbedField> | null | undefined
  readonly provider?: RichEmbedProvider | null | undefined
  readonly video?: RichEmbedVideo | null | undefined
}

export const AllowedMentionTypes = {
  /**
   * Controls role mentions
   */
  USERS: "users",
  /**
   * Controls user mentions
   */
  ROLES: "roles",
  /**
   * Controls @everyone and @here mentions
   */
  EVERYONE: "everyone",
} as const
export type AllowedMentionTypes =
  (typeof AllowedMentionTypes)[keyof typeof AllowedMentionTypes]

export interface MessageAllowedMentionsRequest {
  readonly parse?: ReadonlyArray<null | AllowedMentionTypes> | null | undefined
  readonly users?: ReadonlyArray<null | SnowflakeType> | null | undefined
  readonly roles?: ReadonlyArray<null | SnowflakeType> | null | undefined
  readonly replied_user?: boolean | null | undefined
}

export interface ComponentEmojiForRequest {
  readonly id?: SnowflakeType | null | undefined
  readonly name: string
}

export interface ButtonComponentForMessageRequest {
  readonly type: 2
  readonly id?: number | null | undefined
  readonly custom_id?: string | null | undefined
  readonly style: ButtonStyleTypes
  readonly label?: string | null | undefined
  readonly disabled?: boolean | null | undefined
  readonly url?: string | null | undefined
  readonly sku_id?: SnowflakeType | null | undefined
  readonly emoji?: ComponentEmojiForRequest | null | undefined
}

export interface ChannelSelectDefaultValue {
  readonly type: "channel"
  readonly id: SnowflakeType
}

export interface ChannelSelectComponentForMessageRequest {
  readonly type: 8
  readonly id?: number | null | undefined
  readonly custom_id: string
  readonly placeholder?: string | null | undefined
  readonly min_values?: number | null | undefined
  readonly max_values?: number | null | undefined
  readonly disabled?: boolean | null | undefined
  readonly required?: boolean | null | undefined
  readonly default_values?:
    | ReadonlyArray<ChannelSelectDefaultValue>
    | null
    | undefined
  readonly channel_types?: ReadonlyArray<ChannelTypes> | null | undefined
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
  readonly id?: number | null | undefined
  readonly custom_id: string
  readonly placeholder?: string | null | undefined
  readonly min_values?: number | null | undefined
  readonly max_values?: number | null | undefined
  readonly disabled?: boolean | null | undefined
  readonly required?: boolean | null | undefined
  readonly default_values?:
    | ReadonlyArray<RoleSelectDefaultValue | UserSelectDefaultValue>
    | null
    | undefined
}

export interface RoleSelectComponentForMessageRequest {
  readonly type: 6
  readonly id?: number | null | undefined
  readonly custom_id: string
  readonly placeholder?: string | null | undefined
  readonly min_values?: number | null | undefined
  readonly max_values?: number | null | undefined
  readonly disabled?: boolean | null | undefined
  readonly required?: boolean | null | undefined
  readonly default_values?:
    | ReadonlyArray<RoleSelectDefaultValue>
    | null
    | undefined
}

export interface StringSelectOptionForRequest {
  readonly label: string
  readonly value: string
  readonly description?: string | null | undefined
  readonly default?: boolean | null | undefined
  readonly emoji?: ComponentEmojiForRequest | null | undefined
}

export interface StringSelectComponentForMessageRequest {
  readonly type: 3
  readonly id?: number | null | undefined
  readonly custom_id: string
  readonly placeholder?: string | null | undefined
  readonly min_values?: number | null | undefined
  readonly max_values?: number | null | undefined
  readonly disabled?: boolean | null | undefined
  readonly required?: boolean | null | undefined
  readonly options: ReadonlyArray<StringSelectOptionForRequest>
}

export interface UserSelectComponentForMessageRequest {
  readonly type: 5
  readonly id?: number | null | undefined
  readonly custom_id: string
  readonly placeholder?: string | null | undefined
  readonly min_values?: number | null | undefined
  readonly max_values?: number | null | undefined
  readonly disabled?: boolean | null | undefined
  readonly required?: boolean | null | undefined
  readonly default_values?:
    | ReadonlyArray<UserSelectDefaultValue>
    | null
    | undefined
}

export interface ActionRowComponentForMessageRequest {
  readonly type: 1
  readonly id?: number | null | undefined
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
  readonly id?: number | null | undefined
  readonly spoiler?: boolean | null | undefined
  readonly file: UnfurledMediaRequestWithAttachmentReferenceRequired
}

export interface UnfurledMediaRequest {
  readonly url: string
}

export interface MediaGalleryItemRequest {
  readonly description?: string | null | undefined
  readonly spoiler?: boolean | null | undefined
  readonly media: UnfurledMediaRequest
}

export interface MediaGalleryComponentForMessageRequest {
  readonly type: 12
  readonly id?: number | null | undefined
  readonly items: ReadonlyArray<MediaGalleryItemRequest>
}

export interface TextDisplayComponentForMessageRequest {
  readonly type: 10
  readonly id?: number | null | undefined
  readonly content: string
}

export interface ThumbnailComponentForMessageRequest {
  readonly type: 11
  readonly id?: number | null | undefined
  readonly description?: string | null | undefined
  readonly spoiler?: boolean | null | undefined
  readonly media: UnfurledMediaRequest
}

export interface SectionComponentForMessageRequest {
  readonly type: 9
  readonly id?: number | null | undefined
  readonly components: ReadonlyArray<TextDisplayComponentForMessageRequest>
  readonly accessory:
    | ButtonComponentForMessageRequest
    | ThumbnailComponentForMessageRequest
}

export interface SeparatorComponentForMessageRequest {
  readonly type: 14
  readonly id?: number | null | undefined
  readonly spacing?: MessageComponentSeparatorSpacingSize | null | undefined
  readonly divider?: boolean | null | undefined
}

export interface ContainerComponentForMessageRequest {
  readonly type: 17
  readonly id?: number | null | undefined
  readonly accent_color?: number | null | undefined
  readonly components: ReadonlyArray<
    | ActionRowComponentForMessageRequest
    | FileComponentForMessageRequest
    | MediaGalleryComponentForMessageRequest
    | SectionComponentForMessageRequest
    | SeparatorComponentForMessageRequest
    | TextDisplayComponentForMessageRequest
  >
  readonly spoiler?: boolean | null | undefined
}

export interface MessageAttachmentRequest {
  readonly id: SnowflakeType
  readonly filename?: string | null | undefined
  readonly description?: string | null | undefined
  readonly duration_secs?: number | null | undefined
  readonly waveform?: string | null | undefined
  readonly title?: string | null | undefined
  readonly is_remix?: boolean | null | undefined
}

export interface PollEmoji {
  readonly id?: SnowflakeType | null | undefined
  readonly name?: string | null | undefined
  readonly animated?: boolean | null | undefined
}

export interface PollMedia {
  readonly text?: string | null | undefined
  readonly emoji?: PollEmoji | null | undefined
}

export interface PollEmojiCreateRequest {
  readonly id?: SnowflakeType | null | undefined
  readonly name?: string | null | undefined
  readonly animated?: boolean | null | undefined
}

export interface PollMediaCreateRequest {
  readonly text?: string | null | undefined
  readonly emoji?: PollEmojiCreateRequest | null | undefined
}

export interface PollAnswerCreateRequest {
  readonly poll_media: PollMediaCreateRequest
}

export interface PollCreateRequest {
  readonly question: PollMedia
  readonly answers: ReadonlyArray<PollAnswerCreateRequest>
  readonly allow_multiselect?: boolean | null | undefined
  readonly layout_type?: PollLayoutTypes | null | undefined
  readonly duration?: number | null | undefined
}

export interface CustomClientThemeShareRequest {
  readonly colors: ReadonlyArray<string>
  readonly gradient_angle: number
  readonly base_mix: number
  readonly base_theme?: MessageShareCustomUserThemeBaseTheme | null | undefined
}

export interface ConfettiPotionCreateRequest {}

export interface MessageReferenceRequest {
  readonly guild_id?: SnowflakeType | null | undefined
  readonly channel_id?: SnowflakeType | null | undefined
  readonly message_id: SnowflakeType
  readonly fail_if_not_exists?: boolean | null | undefined
  readonly type?: MessageReferenceType | null | undefined
}

export interface MessageCreateRequest {
  readonly content?: string | null | undefined
  readonly embeds?: ReadonlyArray<RichEmbed> | null | undefined
  readonly allowed_mentions?: MessageAllowedMentionsRequest | null | undefined
  readonly sticker_ids?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly components?:
    | ReadonlyArray<
        | ActionRowComponentForMessageRequest
        | ContainerComponentForMessageRequest
        | FileComponentForMessageRequest
        | MediaGalleryComponentForMessageRequest
        | SectionComponentForMessageRequest
        | SeparatorComponentForMessageRequest
        | TextDisplayComponentForMessageRequest
      >
    | null
    | undefined
  readonly flags?: number | null | undefined
  readonly attachments?:
    | ReadonlyArray<MessageAttachmentRequest>
    | null
    | undefined
  readonly poll?: PollCreateRequest | null | undefined
  readonly shared_client_theme?:
    | CustomClientThemeShareRequest
    | null
    | undefined
  readonly confetti_potion?: ConfettiPotionCreateRequest | null | undefined
  readonly message_reference?: MessageReferenceRequest | null | undefined
  readonly nonce?: number | string | null | undefined
  readonly enforce_nonce?: boolean | null | undefined
  readonly tts?: boolean | null | undefined
}

export interface BulkDeleteMessagesRequest {
  readonly messages: ReadonlyArray<SnowflakeType>
}

export interface ListPinsParams {
  readonly before?: string | undefined
  readonly limit?: number | undefined
}

export interface PinnedMessageResponse {
  readonly pinned_at: string
  readonly message: MessageResponse
}

export interface PinnedMessagesResponse {
  readonly items: ReadonlyArray<PinnedMessageResponse>
  readonly has_more: boolean
}

export interface MessageEditRequestPartial {
  readonly content?: string | null | undefined
  readonly embeds?: ReadonlyArray<RichEmbed> | null | undefined
  readonly flags?: number | null | undefined
  readonly allowed_mentions?: MessageAllowedMentionsRequest | null | undefined
  readonly sticker_ids?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly components?:
    | ReadonlyArray<
        | ActionRowComponentForMessageRequest
        | ContainerComponentForMessageRequest
        | FileComponentForMessageRequest
        | MediaGalleryComponentForMessageRequest
        | SectionComponentForMessageRequest
        | SeparatorComponentForMessageRequest
        | TextDisplayComponentForMessageRequest
      >
    | null
    | undefined
  readonly attachments?:
    | ReadonlyArray<MessageAttachmentRequest>
    | null
    | undefined
}

export const ReactionTypes = {
  /**
   * Normal reaction type
   */
  NORMAL: 0,
  /**
   * Burst reaction type
   */
  BURST: 1,
} as const
export type ReactionTypes = (typeof ReactionTypes)[keyof typeof ReactionTypes]

export interface ListMessageReactionsByEmojiParams {
  readonly after?: SnowflakeType | undefined
  readonly limit?: number | undefined
  readonly type?: ReactionTypes | undefined
}

export type ListMessageReactionsByEmoji200 = ReadonlyArray<UserResponse>

export interface CreateTextThreadWithMessageRequest {
  readonly name: string
  readonly auto_archive_duration?: ThreadAutoArchiveDuration | null | undefined
  readonly rate_limit_per_user?: number | null | undefined
}

export interface SetChannelPermissionOverwriteRequest {
  readonly type?: ChannelPermissionOverwrites | null | undefined
  readonly allow?: number | null | undefined
  readonly deny?: number | null | undefined
}

export type DeprecatedListPins200 = ReadonlyArray<MessageResponse>

export interface GetAnswerVotersParams {
  readonly after?: SnowflakeType | undefined
  readonly limit?: number | undefined
}

export interface PollAnswerDetailsResponse {
  readonly users: ReadonlyArray<UserResponse>
}

export interface AddGroupDmUserRequest {
  readonly access_token?: string | null | undefined
  readonly nick?: string | null | undefined
}

export type AddGroupDmUser201 =
  | PrivateChannelResponse
  | PrivateGroupChannelResponse

export interface SoundboardSoundSendRequest {
  readonly sound_id: SnowflakeType
  readonly source_guild_id?: SnowflakeType | null | undefined
}

export interface ListThreadMembersParams {
  readonly with_member?: boolean | undefined
  readonly limit?: number | undefined
  readonly after?: SnowflakeType | undefined
}

export type ListThreadMembers200 = ReadonlyArray<ThreadMemberResponse>

export interface GetThreadMemberParams {
  readonly with_member?: boolean | undefined
}

export interface BaseCreateMessageCreateRequest {
  readonly content?: string | null | undefined
  readonly embeds?: ReadonlyArray<RichEmbed> | null | undefined
  readonly allowed_mentions?: MessageAllowedMentionsRequest | null | undefined
  readonly sticker_ids?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly components?:
    | ReadonlyArray<
        | ActionRowComponentForMessageRequest
        | ContainerComponentForMessageRequest
        | FileComponentForMessageRequest
        | MediaGalleryComponentForMessageRequest
        | SectionComponentForMessageRequest
        | SeparatorComponentForMessageRequest
        | TextDisplayComponentForMessageRequest
      >
    | null
    | undefined
  readonly flags?: number | null | undefined
  readonly attachments?:
    | ReadonlyArray<MessageAttachmentRequest>
    | null
    | undefined
  readonly poll?: PollCreateRequest | null | undefined
  readonly shared_client_theme?:
    | CustomClientThemeShareRequest
    | null
    | undefined
  readonly confetti_potion?: ConfettiPotionCreateRequest | null | undefined
}

export interface CreateForumThreadRequest {
  readonly name: string
  readonly auto_archive_duration?: ThreadAutoArchiveDuration | null | undefined
  readonly rate_limit_per_user?: number | null | undefined
  readonly applied_tags?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly message: BaseCreateMessageCreateRequest
}

export interface CreateTextThreadWithoutMessageRequest {
  readonly name: string
  readonly auto_archive_duration?: ThreadAutoArchiveDuration | null | undefined
  readonly rate_limit_per_user?: number | null | undefined
  readonly type?: 10 | 11 | 12 | null | undefined
  readonly invitable?: boolean | null | undefined
}

export type CreateThreadRequest =
  | CreateForumThreadRequest
  | CreateTextThreadWithoutMessageRequest

export interface CreatedThreadResponse {
  readonly id: SnowflakeType
  readonly type: 10 | 11 | 12
  readonly last_message_id?: SnowflakeType | null | undefined
  readonly flags: number
  readonly last_pin_timestamp?: string | null | undefined
  readonly guild_id: SnowflakeType
  readonly name: string
  readonly parent_id?: SnowflakeType | null | undefined
  readonly rate_limit_per_user?: number | undefined
  readonly bitrate?: number | undefined
  readonly user_limit?: number | undefined
  readonly rtc_region?: string | null | undefined
  readonly video_quality_mode?: VideoQualityModes | undefined
  readonly permissions?: string | null | undefined
  readonly owner_id: SnowflakeType
  readonly thread_metadata: ThreadMetadataResponse
  readonly message_count: number
  readonly member_count: number
  readonly total_message_sent: number
  readonly applied_tags?: ReadonlyArray<SnowflakeType> | undefined
  readonly member?: ThreadMemberResponse | undefined
}

export interface ListPrivateArchivedThreadsParams {
  readonly before?: string | undefined
  readonly limit?: number | undefined
}

export interface ThreadsResponse {
  readonly threads: ReadonlyArray<ThreadResponse>
  readonly members: ReadonlyArray<ThreadMemberResponse>
  readonly has_more: boolean
  readonly first_messages?: ReadonlyArray<MessageResponse> | undefined
}

export interface ListPublicArchivedThreadsParams {
  readonly before?: string | undefined
  readonly limit?: number | undefined
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
  readonly name?: string | undefined
  readonly slop?: number | undefined
  readonly min_id?: SnowflakeType | undefined
  readonly max_id?: SnowflakeType | undefined
  readonly tag?: string | ReadonlyArray<SnowflakeType> | undefined
  readonly tag_setting?: ThreadSearchTagSetting | undefined
  readonly archived?: boolean | undefined
  readonly sort_by?: ThreadSortingMode | undefined
  readonly sort_order?: SortingOrder | undefined
  readonly limit?: number | undefined
  readonly offset?: number | undefined
}

export interface ThreadSearchResponse {
  readonly threads: ReadonlyArray<ThreadResponse>
  readonly members: ReadonlyArray<ThreadMemberResponse>
  readonly has_more: boolean
  readonly first_messages?: ReadonlyArray<MessageResponse> | undefined
  readonly total_results: number
}

export interface TypingIndicatorResponse {}

export interface ListMyPrivateArchivedThreadsParams {
  readonly before?: SnowflakeType | undefined
  readonly limit?: number | undefined
}

export const WebhookTypes = {
  /**
   * Incoming Webhooks can post messages to channels with a generated token
   */
  GUILD_INCOMING: 1,
  /**
   * Channel Follower Webhooks are internal webhooks used with Channel Following to post new messages into channels
   */
  CHANNEL_FOLLOWER: 2,
  /**
   * Application webhooks are webhooks used with Interactions
   */
  APPLICATION_INCOMING: 3,
} as const
export type WebhookTypes = (typeof WebhookTypes)[keyof typeof WebhookTypes]

export interface ApplicationIncomingWebhookResponse {
  readonly application_id?: SnowflakeType | null | undefined
  readonly avatar?: string | null | undefined
  readonly channel_id?: SnowflakeType | null | undefined
  readonly guild_id?: SnowflakeType | null | undefined
  readonly id: SnowflakeType
  readonly name: string
  readonly type: 3
  readonly user?: UserResponse | undefined
}

export interface WebhookSourceGuildResponse {
  readonly id: SnowflakeType
  readonly icon?: string | null | undefined
  readonly name: string
}

export interface WebhookSourceChannelResponse {
  readonly id: SnowflakeType
  readonly name: string
}

export interface ChannelFollowerWebhookResponse {
  readonly application_id?: SnowflakeType | null | undefined
  readonly avatar?: string | null | undefined
  readonly channel_id?: SnowflakeType | null | undefined
  readonly guild_id?: SnowflakeType | null | undefined
  readonly id: SnowflakeType
  readonly name: string
  readonly type: 2
  readonly user?: UserResponse | undefined
  readonly source_guild?: WebhookSourceGuildResponse | undefined
  readonly source_channel?: WebhookSourceChannelResponse | undefined
}

export interface GuildIncomingWebhookResponse {
  readonly application_id?: SnowflakeType | null | undefined
  readonly avatar?: string | null | undefined
  readonly channel_id?: SnowflakeType | null | undefined
  readonly guild_id?: SnowflakeType | null | undefined
  readonly id: SnowflakeType
  readonly name: string
  readonly type: 1
  readonly user?: UserResponse | undefined
  readonly token?: string | undefined
  readonly url?: string | undefined
}

export type ListChannelWebhooks200 = ReadonlyArray<
  | ApplicationIncomingWebhookResponse
  | ChannelFollowerWebhookResponse
  | GuildIncomingWebhookResponse
>

export interface CreateWebhookRequest {
  readonly name: string
  readonly avatar?: string | null | undefined
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
  /**
   * members will receive notifications for all messages by default
   */
  ALL_MESSAGES: 0,
  /**
   * members will receive notifications only for messages that @mention them by default
   */
  ONLY_MENTIONS: 1,
} as const
export type UserNotificationSettings =
  (typeof UserNotificationSettings)[keyof typeof UserNotificationSettings]

export const GuildExplicitContentFilterTypes = {
  /**
   * media content will not be scanned
   */
  DISABLED: 0,
  /**
   * media content sent by members without roles will be scanned
   */
  MEMBERS_WITHOUT_ROLES: 1,
  /**
   * media content sent by all members will be scanned
   */
  ALL_MEMBERS: 2,
} as const
export type GuildExplicitContentFilterTypes =
  (typeof GuildExplicitContentFilterTypes)[keyof typeof GuildExplicitContentFilterTypes]

export const AvailableLocalesEnum = {
  /**
   * The ar locale
   */
  ar: "ar",
  /**
   * The bg locale
   */
  bg: "bg",
  /**
   * The cs locale
   */
  cs: "cs",
  /**
   * The da locale
   */
  da: "da",
  /**
   * The de locale
   */
  de: "de",
  /**
   * The el locale
   */
  el: "el",
  /**
   * The en-GB locale
   */
  "en-GB": "en-GB",
  /**
   * The en-US locale
   */
  "en-US": "en-US",
  /**
   * The es-419 locale
   */
  "es-419": "es-419",
  /**
   * The es-ES locale
   */
  "es-ES": "es-ES",
  /**
   * The fi locale
   */
  fi: "fi",
  /**
   * The fr locale
   */
  fr: "fr",
  /**
   * The he locale
   */
  he: "he",
  /**
   * The hi locale
   */
  hi: "hi",
  /**
   * The hr locale
   */
  hr: "hr",
  /**
   * The hu locale
   */
  hu: "hu",
  /**
   * The id locale
   */
  id: "id",
  /**
   * The it locale
   */
  it: "it",
  /**
   * The ja locale
   */
  ja: "ja",
  /**
   * The ko locale
   */
  ko: "ko",
  /**
   * The lt locale
   */
  lt: "lt",
  /**
   * The nl locale
   */
  nl: "nl",
  /**
   * The no locale
   */
  no: "no",
  /**
   * The pl locale
   */
  pl: "pl",
  /**
   * The pt-BR locale
   */
  "pt-BR": "pt-BR",
  /**
   * The ro locale
   */
  ro: "ro",
  /**
   * The ru locale
   */
  ru: "ru",
  /**
   * The sv-SE locale
   */
  "sv-SE": "sv-SE",
  /**
   * The th locale
   */
  th: "th",
  /**
   * The tr locale
   */
  tr: "tr",
  /**
   * The uk locale
   */
  uk: "uk",
  /**
   * The vi locale
   */
  vi: "vi",
  /**
   * The zh-CN locale
   */
  "zh-CN": "zh-CN",
  /**
   * The zh-TW locale
   */
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

export interface GuildTemplateRoleColorsResponse {
  readonly primary_color: number
  readonly secondary_color?: number | null | undefined
  readonly tertiary_color?: number | null | undefined
}

export interface GuildTemplateRoleResponse {
  readonly id: number
  readonly name: string
  readonly permissions: string
  readonly color: number
  readonly colors?: GuildTemplateRoleColorsResponse | null | undefined
  readonly hoist: boolean
  readonly mentionable: boolean
  readonly icon?: string | null | undefined
  readonly unicode_emoji?: string | null | undefined
}

export interface GuildTemplateChannelTags {
  readonly id?: number | null | undefined
  readonly name: string
  readonly emoji_id?: SnowflakeType | null | undefined
  readonly emoji_name?: string | null | undefined
  readonly moderated?: boolean | null | undefined
}

export interface IconEmojiResponse {}

export interface GuildTemplateChannelResponse {
  readonly id?: number | null | undefined
  readonly type: 0 | 2 | 4 | 15
  readonly name?: string | null | undefined
  readonly position?: number | null | undefined
  readonly topic?: string | null | undefined
  readonly bitrate: number
  readonly user_limit: number
  readonly nsfw: boolean
  readonly rate_limit_per_user: number
  readonly parent_id?: SnowflakeType | null | undefined
  readonly default_auto_archive_duration?:
    | ThreadAutoArchiveDuration
    | null
    | undefined
  readonly permission_overwrites: ReadonlyArray<null | ChannelPermissionOverwriteResponse>
  readonly available_tags?:
    | ReadonlyArray<GuildTemplateChannelTags>
    | null
    | undefined
  readonly template: string
  readonly default_reaction_emoji?:
    | DefaultReactionEmojiResponse
    | null
    | undefined
  readonly default_thread_rate_limit_per_user?: number | null | undefined
  readonly default_sort_order?: ThreadSortOrder | null | undefined
  readonly default_forum_layout?: ForumLayout | null | undefined
  readonly default_tag_setting?: ThreadSearchTagSetting | null | undefined
  readonly icon_emoji?: IconEmojiResponse | null | undefined
  readonly theme_color?: number | null | undefined
}

export interface GuildTemplateSnapshotResponse {
  readonly name: string
  readonly description?: string | null | undefined
  readonly region?: string | null | undefined
  readonly verification_level: VerificationLevels
  readonly default_message_notifications: UserNotificationSettings
  readonly explicit_content_filter: GuildExplicitContentFilterTypes
  readonly preferred_locale: AvailableLocalesEnum
  readonly afk_channel_id?: SnowflakeType | null | undefined
  readonly afk_timeout: AfkTimeouts
  readonly system_channel_id?: SnowflakeType | null | undefined
  readonly system_channel_flags: number
  readonly roles: ReadonlyArray<GuildTemplateRoleResponse>
  readonly channels: ReadonlyArray<GuildTemplateChannelResponse>
}

export interface GuildTemplateResponse {
  readonly code: string
  readonly name: string
  readonly description?: string | null | undefined
  readonly usage_count: number
  readonly creator_id: SnowflakeType
  readonly creator?: UserResponse | null | undefined
  readonly created_at: string
  readonly updated_at: string
  readonly source_guild_id: SnowflakeType
  readonly serialized_source_guild: GuildTemplateSnapshotResponse
  readonly is_dirty?: boolean | null | undefined
}

export interface GetGuildParams {
  readonly with_counts?: boolean | undefined
}

export interface GuildRoleColorsResponse {
  readonly primary_color: number
  readonly secondary_color?: number | null | undefined
  readonly tertiary_color?: number | null | undefined
}

export interface GuildRoleTagsResponse {
  readonly premium_subscriber?: null | undefined
  readonly bot_id?: SnowflakeType | undefined
  readonly integration_id?: SnowflakeType | undefined
  readonly subscription_listing_id?: SnowflakeType | undefined
  readonly available_for_purchase?: null | undefined
  readonly guild_connections?: null | undefined
}

export interface GuildRoleResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly description?: string | null | undefined
  readonly permissions: string
  readonly position: number
  readonly color: number
  readonly colors: GuildRoleColorsResponse
  readonly hoist: boolean
  readonly managed: boolean
  readonly mentionable: boolean
  readonly icon?: string | null | undefined
  readonly unicode_emoji?: string | null | undefined
  readonly tags?: GuildRoleTagsResponse | undefined
  readonly flags: number
}

export const GuildMFALevel = {
  /**
   * Guild has no MFA/2FA requirement for moderation actions
   */
  NONE: 0,
  /**
   * Guild has a 2FA requirement for moderation actions
   */
  ELEVATED: 1,
} as const
export type GuildMFALevel = (typeof GuildMFALevel)[keyof typeof GuildMFALevel]

export const PremiumGuildTiers = {
  /**
   * Guild has not unlocked any Server Boost perks
   */
  NONE: 0,
  /**
   * Guild has unlocked Server Boost level 1 perks
   */
  TIER_1: 1,
  /**
   * Guild has unlocked Server Boost level 2 perks
   */
  TIER_2: 2,
  /**
   * Guild has unlocked Server Boost level 3 perks
   */
  TIER_3: 3,
} as const
export type PremiumGuildTiers =
  (typeof PremiumGuildTiers)[keyof typeof PremiumGuildTiers]

export interface GuildWithCountsResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly icon?: string | null | undefined
  readonly description?: string | null | undefined
  readonly home_header?: string | null | undefined
  readonly splash?: string | null | undefined
  readonly discovery_splash?: string | null | undefined
  readonly features: ReadonlyArray<GuildFeatures>
  readonly banner?: string | null | undefined
  readonly owner_id: SnowflakeType
  readonly application_id?: SnowflakeType | null | undefined
  readonly region: string
  readonly afk_channel_id?: SnowflakeType | null | undefined
  readonly afk_timeout: AfkTimeouts
  readonly system_channel_id?: SnowflakeType | null | undefined
  readonly system_channel_flags: number
  readonly widget_enabled: boolean
  readonly widget_channel_id?: SnowflakeType | null | undefined
  readonly verification_level: VerificationLevels
  readonly roles: ReadonlyArray<GuildRoleResponse>
  readonly default_message_notifications: UserNotificationSettings
  readonly mfa_level: GuildMFALevel
  readonly explicit_content_filter: GuildExplicitContentFilterTypes
  readonly max_presences?: number | null | undefined
  readonly max_members: number
  readonly max_stage_video_channel_users: number
  readonly max_video_channel_users: number
  readonly vanity_url_code?: string | null | undefined
  readonly premium_tier: PremiumGuildTiers
  readonly premium_subscription_count: number
  readonly preferred_locale: AvailableLocalesEnum
  readonly rules_channel_id?: SnowflakeType | null | undefined
  readonly safety_alerts_channel_id?: SnowflakeType | null | undefined
  readonly public_updates_channel_id?: SnowflakeType | null | undefined
  readonly premium_progress_bar_enabled: boolean
  readonly nsfw: boolean
  readonly nsfw_level: GuildNSFWContentLevel
  readonly emojis: ReadonlyArray<EmojiResponse>
  readonly stickers: ReadonlyArray<GuildStickerResponse>
  readonly approximate_member_count?: number | null | undefined
  readonly approximate_presence_count?: number | null | undefined
}

export interface GuildPatchRequestPartial {
  readonly name?: string | undefined
  readonly description?: string | null | undefined
  readonly region?: string | null | undefined
  readonly icon?: string | null | undefined
  readonly verification_level?: VerificationLevels | null | undefined
  readonly default_message_notifications?:
    | UserNotificationSettings
    | null
    | undefined
  readonly explicit_content_filter?:
    | GuildExplicitContentFilterTypes
    | null
    | undefined
  readonly preferred_locale?: AvailableLocalesEnum | null | undefined
  readonly afk_timeout?: AfkTimeouts | null | undefined
  readonly afk_channel_id?: SnowflakeType | null | undefined
  readonly system_channel_id?: SnowflakeType | null | undefined
  readonly splash?: string | null | undefined
  readonly banner?: string | null | undefined
  readonly system_channel_flags?: number | null | undefined
  readonly features?: ReadonlyArray<string> | null | undefined
  readonly discovery_splash?: string | null | undefined
  readonly home_header?: string | null | undefined
  readonly rules_channel_id?: SnowflakeType | null | undefined
  readonly safety_alerts_channel_id?: SnowflakeType | null | undefined
  readonly public_updates_channel_id?: SnowflakeType | null | undefined
  readonly premium_progress_bar_enabled?: boolean | null | undefined
}

export interface GuildResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly icon?: string | null | undefined
  readonly description?: string | null | undefined
  readonly home_header?: string | null | undefined
  readonly splash?: string | null | undefined
  readonly discovery_splash?: string | null | undefined
  readonly features: ReadonlyArray<GuildFeatures>
  readonly banner?: string | null | undefined
  readonly owner_id: SnowflakeType
  readonly application_id?: SnowflakeType | null | undefined
  readonly region: string
  readonly afk_channel_id?: SnowflakeType | null | undefined
  readonly afk_timeout: AfkTimeouts
  readonly system_channel_id?: SnowflakeType | null | undefined
  readonly system_channel_flags: number
  readonly widget_enabled: boolean
  readonly widget_channel_id?: SnowflakeType | null | undefined
  readonly verification_level: VerificationLevels
  readonly roles: ReadonlyArray<GuildRoleResponse>
  readonly default_message_notifications: UserNotificationSettings
  readonly mfa_level: GuildMFALevel
  readonly explicit_content_filter: GuildExplicitContentFilterTypes
  readonly max_presences?: number | null | undefined
  readonly max_members: number
  readonly max_stage_video_channel_users: number
  readonly max_video_channel_users: number
  readonly vanity_url_code?: string | null | undefined
  readonly premium_tier: PremiumGuildTiers
  readonly premium_subscription_count: number
  readonly preferred_locale: AvailableLocalesEnum
  readonly rules_channel_id?: SnowflakeType | null | undefined
  readonly safety_alerts_channel_id?: SnowflakeType | null | undefined
  readonly public_updates_channel_id?: SnowflakeType | null | undefined
  readonly premium_progress_bar_enabled: boolean
  readonly nsfw: boolean
  readonly nsfw_level: GuildNSFWContentLevel
  readonly emojis: ReadonlyArray<EmojiResponse>
  readonly stickers: ReadonlyArray<GuildStickerResponse>
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

export interface ListGuildAuditLogEntriesParams {
  readonly user_id?: SnowflakeType | undefined
  readonly target_id?: SnowflakeType | undefined
  readonly action_type?: AuditLogActionTypes | undefined
  readonly before?: SnowflakeType | undefined
  readonly after?: SnowflakeType | undefined
  readonly limit?: number | undefined
}

export interface AuditLogObjectChangeResponse {
  readonly key?: string | null | undefined
}

export interface AuditLogEntryResponse {
  readonly id: SnowflakeType
  readonly action_type: AuditLogActionTypes
  readonly user_id?: SnowflakeType | null | undefined
  readonly target_id?: SnowflakeType | null | undefined
  readonly changes?: ReadonlyArray<AuditLogObjectChangeResponse> | undefined
  readonly options?: Record<string, unknown> | undefined
  readonly reason?: string | undefined
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
  readonly name?: string | null | undefined
}

export interface PartialDiscordIntegrationResponse {
  readonly id: SnowflakeType
  readonly type: "discord"
  readonly name?: string | null | undefined
  readonly account: AccountResponse
  readonly application_id: SnowflakeType
}

export interface PartialExternalConnectionIntegrationResponse {
  readonly id: SnowflakeType
  readonly type: "twitch" | "youtube"
  readonly name?: string | null | undefined
  readonly account: AccountResponse
}

export interface PartialGuildSubscriptionIntegrationResponse {
  readonly id: SnowflakeType
  readonly type: "guild_subscription"
  readonly name?: string | null | undefined
  readonly account: AccountResponse
}

export interface EntityMetadataExternalResponse {
  readonly location: string
}

export interface ExternalScheduledEventResponse {
  readonly id: SnowflakeType
  readonly guild_id: SnowflakeType
  readonly name: string
  readonly description?: string | null | undefined
  readonly channel_id?: SnowflakeType | null | undefined
  readonly creator_id?: SnowflakeType | null | undefined
  readonly creator?: UserResponse | undefined
  readonly image?: string | null | undefined
  readonly scheduled_start_time: string
  readonly scheduled_end_time?: string | null | undefined
  readonly status: GuildScheduledEventStatuses
  readonly entity_type: 3
  readonly entity_id?: SnowflakeType | null | undefined
  readonly user_count?: number | undefined
  readonly privacy_level: GuildScheduledEventPrivacyLevels
  readonly user_rsvp?: ScheduledEventUserResponse | null | undefined
  readonly entity_metadata: EntityMetadataExternalResponse
}

export interface EntityMetadataStageInstanceResponse {}

export interface StageScheduledEventResponse {
  readonly id: SnowflakeType
  readonly guild_id: SnowflakeType
  readonly name: string
  readonly description?: string | null | undefined
  readonly channel_id?: SnowflakeType | null | undefined
  readonly creator_id?: SnowflakeType | null | undefined
  readonly creator?: UserResponse | undefined
  readonly image?: string | null | undefined
  readonly scheduled_start_time: string
  readonly scheduled_end_time?: string | null | undefined
  readonly status: GuildScheduledEventStatuses
  readonly entity_type: 1
  readonly entity_id?: SnowflakeType | null | undefined
  readonly user_count?: number | undefined
  readonly privacy_level: GuildScheduledEventPrivacyLevels
  readonly user_rsvp?: ScheduledEventUserResponse | null | undefined
  readonly entity_metadata?:
    | EntityMetadataStageInstanceResponse
    | null
    | undefined
}

export interface EntityMetadataVoiceResponse {}

export interface VoiceScheduledEventResponse {
  readonly id: SnowflakeType
  readonly guild_id: SnowflakeType
  readonly name: string
  readonly description?: string | null | undefined
  readonly channel_id?: SnowflakeType | null | undefined
  readonly creator_id?: SnowflakeType | null | undefined
  readonly creator?: UserResponse | undefined
  readonly image?: string | null | undefined
  readonly scheduled_start_time: string
  readonly scheduled_end_time?: string | null | undefined
  readonly status: GuildScheduledEventStatuses
  readonly entity_type: 2
  readonly entity_id?: SnowflakeType | null | undefined
  readonly user_count?: number | undefined
  readonly privacy_level: GuildScheduledEventPrivacyLevels
  readonly user_rsvp?: ScheduledEventUserResponse | null | undefined
  readonly entity_metadata?: EntityMetadataVoiceResponse | null | undefined
}

export const AutomodEventType = {
  /**
   * A user submitted a message to a channel
   */
  MESSAGE_SEND: 1,
  /**
   * A user is attempting to join the server or a member's properties were updated.
   */
  GUILD_MEMBER_JOIN_OR_UPDATE: 2,
} as const
export type AutomodEventType =
  (typeof AutomodEventType)[keyof typeof AutomodEventType]

export const AutomodActionType = {
  /**
   * Block a user's message and prevent it from being posted. A custom explanation can be specified and shown to members whenever their message is blocked
   */
  BLOCK_MESSAGE: 1,
  /**
   * Send a system message to a channel in order to log the user message that triggered the rule
   */
  FLAG_TO_CHANNEL: 2,
  /**
   * Temporarily disable a user's ability to communicate in the server (timeout)
   */
  USER_COMMUNICATION_DISABLED: 3,
  /**
   * Prevent a user from interacting in the server
   */
  QUARANTINE_USER: 4,
} as const
export type AutomodActionType =
  (typeof AutomodActionType)[keyof typeof AutomodActionType]

export interface BlockMessageActionMetadataResponse {
  readonly custom_message?: string | undefined
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
  /**
   * Check if content contains words from a list of keywords or matches regex
   */
  KEYWORD: 1,
  /**
   * DEPRECATED
   */
  SPAM_LINK: 2,
  /**
   * Check if content represents generic spam
   */
  ML_SPAM: 3,
  /**
   * Check if content contains words from internal pre-defined wordsets
   */
  DEFAULT_KEYWORD_LIST: 4,
  /**
   * Check if content contains more unique mentions than allowed
   */
  MENTION_SPAM: 5,
} as const
export type AutomodTriggerType =
  (typeof AutomodTriggerType)[keyof typeof AutomodTriggerType]

export const AutomodKeywordPresetType = {
  /**
   * Words and phrases that may be considered profanity
   */
  PROFANITY: 1,
  /**
   * Words and phrases that may be considered as sexual content
   */
  SEXUAL_CONTENT: 2,
  /**
   * Words and phrases that may be considered slurs and hate speech
   */
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
  readonly enabled: boolean
  readonly exempt_roles: ReadonlyArray<SnowflakeType>
  readonly exempt_channels: ReadonlyArray<SnowflakeType>
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
  readonly enabled: boolean
  readonly exempt_roles: ReadonlyArray<SnowflakeType>
  readonly exempt_channels: ReadonlyArray<SnowflakeType>
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
  readonly enabled: boolean
  readonly exempt_roles: ReadonlyArray<SnowflakeType>
  readonly exempt_channels: ReadonlyArray<SnowflakeType>
  readonly trigger_metadata: MLSpamTriggerMetadataResponse
}

export interface MentionSpamTriggerMetadataResponse {
  readonly mention_total_limit: number
  readonly mention_raid_protection_enabled: boolean
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
  readonly enabled: boolean
  readonly exempt_roles: ReadonlyArray<SnowflakeType>
  readonly exempt_channels: ReadonlyArray<SnowflakeType>
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
  readonly enabled: boolean
  readonly exempt_roles: ReadonlyArray<SnowflakeType>
  readonly exempt_channels: ReadonlyArray<SnowflakeType>
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
  readonly custom_message?: string | null | undefined
}

export interface BlockMessageAction {
  readonly type: 1
  readonly metadata?: BlockMessageActionMetadata | null | undefined
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
  readonly metadata?: QuarantineUserActionMetadata | null | undefined
}

export interface UserCommunicationDisabledActionMetadata {
  readonly duration_seconds?: number | null | undefined
}

export interface UserCommunicationDisabledAction {
  readonly type: 3
  readonly metadata: UserCommunicationDisabledActionMetadata
}

export interface DefaultKeywordListTriggerMetadata {
  readonly allow_list?: ReadonlyArray<string> | null | undefined
  readonly presets?: ReadonlyArray<AutomodKeywordPresetType> | null | undefined
}

export interface DefaultKeywordListUpsertRequest {
  readonly name: string
  readonly event_type: AutomodEventType
  readonly actions?:
    | ReadonlyArray<
        | BlockMessageAction
        | FlagToChannelAction
        | QuarantineUserAction
        | UserCommunicationDisabledAction
      >
    | null
    | undefined
  readonly enabled?: boolean | null | undefined
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly trigger_type: 4
  readonly trigger_metadata: DefaultKeywordListTriggerMetadata
}

export interface KeywordTriggerMetadata {
  readonly keyword_filter?: ReadonlyArray<string> | null | undefined
  readonly regex_patterns?: ReadonlyArray<string> | null | undefined
  readonly allow_list?: ReadonlyArray<string> | null | undefined
}

export interface KeywordUpsertRequest {
  readonly name: string
  readonly event_type: AutomodEventType
  readonly actions?:
    | ReadonlyArray<
        | BlockMessageAction
        | FlagToChannelAction
        | QuarantineUserAction
        | UserCommunicationDisabledAction
      >
    | null
    | undefined
  readonly enabled?: boolean | null | undefined
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly trigger_type: 1
  readonly trigger_metadata?: KeywordTriggerMetadata | null | undefined
}

export interface MLSpamTriggerMetadata {}

export interface MLSpamUpsertRequest {
  readonly name: string
  readonly event_type: AutomodEventType
  readonly actions?:
    | ReadonlyArray<
        | BlockMessageAction
        | FlagToChannelAction
        | QuarantineUserAction
        | UserCommunicationDisabledAction
      >
    | null
    | undefined
  readonly enabled?: boolean | null | undefined
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly trigger_type: 3
  readonly trigger_metadata?: MLSpamTriggerMetadata | null | undefined
}

export interface MentionSpamTriggerMetadata {
  readonly mention_total_limit?: number | null | undefined
  readonly mention_raid_protection_enabled?: boolean | null | undefined
}

export interface MentionSpamUpsertRequest {
  readonly name: string
  readonly event_type: AutomodEventType
  readonly actions?:
    | ReadonlyArray<
        | BlockMessageAction
        | FlagToChannelAction
        | QuarantineUserAction
        | UserCommunicationDisabledAction
      >
    | null
    | undefined
  readonly enabled?: boolean | null | undefined
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly trigger_type: 5
  readonly trigger_metadata?: MentionSpamTriggerMetadata | null | undefined
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
  readonly name?: string | undefined
  readonly event_type?: AutomodEventType | undefined
  readonly actions?:
    | ReadonlyArray<
        | BlockMessageAction
        | FlagToChannelAction
        | QuarantineUserAction
        | UserCommunicationDisabledAction
      >
    | null
    | undefined
  readonly enabled?: boolean | null | undefined
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly trigger_type?: 4 | undefined
  readonly trigger_metadata?: DefaultKeywordListTriggerMetadata | undefined
}

export interface KeywordUpsertRequestPartial {
  readonly name?: string | undefined
  readonly event_type?: AutomodEventType | undefined
  readonly actions?:
    | ReadonlyArray<
        | BlockMessageAction
        | FlagToChannelAction
        | QuarantineUserAction
        | UserCommunicationDisabledAction
      >
    | null
    | undefined
  readonly enabled?: boolean | null | undefined
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly trigger_type?: 1 | undefined
  readonly trigger_metadata?: KeywordTriggerMetadata | null | undefined
}

export interface MLSpamUpsertRequestPartial {
  readonly name?: string | undefined
  readonly event_type?: AutomodEventType | undefined
  readonly actions?:
    | ReadonlyArray<
        | BlockMessageAction
        | FlagToChannelAction
        | QuarantineUserAction
        | UserCommunicationDisabledAction
      >
    | null
    | undefined
  readonly enabled?: boolean | null | undefined
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly trigger_type?: 3 | undefined
  readonly trigger_metadata?: MLSpamTriggerMetadata | null | undefined
}

export interface MentionSpamUpsertRequestPartial {
  readonly name?: string | undefined
  readonly event_type?: AutomodEventType | undefined
  readonly actions?:
    | ReadonlyArray<
        | BlockMessageAction
        | FlagToChannelAction
        | QuarantineUserAction
        | UserCommunicationDisabledAction
      >
    | null
    | undefined
  readonly enabled?: boolean | null | undefined
  readonly exempt_roles?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly exempt_channels?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly trigger_type?: 5 | undefined
  readonly trigger_metadata?: MentionSpamTriggerMetadata | null | undefined
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
  readonly limit?: number | undefined
  readonly before?: SnowflakeType | undefined
  readonly after?: SnowflakeType | undefined
}

export interface GuildBanResponse {
  readonly user: UserResponse
  readonly reason?: string | null | undefined
}

export type ListGuildBans200 = ReadonlyArray<GuildBanResponse>

export interface BanUserFromGuildRequest {
  readonly delete_message_seconds?: number | null | undefined
  readonly delete_message_days?: number | null | undefined
}

export interface UnbanUserFromGuildRequest {}

export interface BulkBanUsersRequest {
  readonly user_ids: ReadonlyArray<SnowflakeType>
  readonly delete_message_seconds?: number | null | undefined
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

export interface CreateOrUpdateThreadTagRequest {
  readonly name: string
  readonly emoji_id?: SnowflakeType | null | undefined
  readonly emoji_name?: string | null | undefined
  readonly moderated?: boolean | null | undefined
}

export interface CreateGuildChannelRequest {
  readonly type?: 0 | 2 | 4 | 5 | 13 | 14 | 15 | null | undefined
  readonly name: string
  readonly position?: number | null | undefined
  readonly topic?: string | null | undefined
  readonly bitrate?: number | null | undefined
  readonly user_limit?: number | null | undefined
  readonly nsfw?: boolean | null | undefined
  readonly rate_limit_per_user?: number | null | undefined
  readonly parent_id?: SnowflakeType | null | undefined
  readonly permission_overwrites?:
    | ReadonlyArray<ChannelPermissionOverwriteRequest>
    | null
    | undefined
  readonly rtc_region?: string | null | undefined
  readonly video_quality_mode?: VideoQualityModes | null | undefined
  readonly default_auto_archive_duration?:
    | ThreadAutoArchiveDuration
    | null
    | undefined
  readonly default_reaction_emoji?:
    | UpdateDefaultReactionEmojiRequest
    | null
    | undefined
  readonly default_thread_rate_limit_per_user?: number | null | undefined
  readonly default_sort_order?: ThreadSortOrder | null | undefined
  readonly default_forum_layout?: ForumLayout | null | undefined
  readonly default_tag_setting?: ThreadSearchTagSetting | null | undefined
  readonly available_tags?:
    | ReadonlyArray<null | CreateOrUpdateThreadTagRequest>
    | null
    | undefined
}

export type BulkUpdateGuildChannelsRequest = ReadonlyArray<{
  readonly id?: SnowflakeType | null | undefined
  readonly position?: number | null | undefined
  readonly parent_id?: SnowflakeType | null | undefined
  readonly lock_permissions?: boolean | null | undefined
}>

export type ListGuildEmojis200 = ReadonlyArray<EmojiResponse>

export interface CreateGuildEmojiRequest {
  readonly name: string
  readonly image: string
  readonly roles?: ReadonlyArray<null | SnowflakeType> | null | undefined
}

export interface UpdateGuildEmojiRequest {
  readonly name?: string | undefined
  readonly roles?: ReadonlyArray<null | SnowflakeType> | null | undefined
}

export interface IntegrationApplicationResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly icon?: string | null | undefined
  readonly description: string
  readonly type?: ApplicationTypes | null | undefined
  readonly cover_image?: string | undefined
  readonly primary_sku_id?: SnowflakeType | undefined
  readonly bot?: UserResponse | undefined
}

export interface DiscordIntegrationResponse {
  readonly type: "discord"
  readonly name?: string | null | undefined
  readonly account: AccountResponse
  readonly enabled: boolean
  readonly id: SnowflakeType
  readonly application: IntegrationApplicationResponse
  readonly scopes: ReadonlyArray<
    "applications.commands" | "bot" | "webhook.incoming"
  >
  readonly user?: UserResponse | undefined
}

export const IntegrationExpireBehaviorTypes = {
  /**
   * Remove role
   */
  REMOVE_ROLE: 0,
  /**
   * Kick
   */
  KICK: 1,
} as const
export type IntegrationExpireBehaviorTypes =
  (typeof IntegrationExpireBehaviorTypes)[keyof typeof IntegrationExpireBehaviorTypes]

export const IntegrationExpireGracePeriodTypes = {
  /**
   * 1 day
   */
  ONE_DAY: 1,
  /**
   * 3 days
   */
  THREE_DAYS: 3,
  /**
   * 7 days
   */
  SEVEN_DAYS: 7,
  /**
   * 14 days
   */
  FOURTEEN_DAYS: 14,
  /**
   * 30 days
   */
  THIRTY_DAYS: 30,
} as const
export type IntegrationExpireGracePeriodTypes =
  (typeof IntegrationExpireGracePeriodTypes)[keyof typeof IntegrationExpireGracePeriodTypes]

export interface ExternalConnectionIntegrationResponse {
  readonly type: "twitch" | "youtube"
  readonly name?: string | null | undefined
  readonly account: AccountResponse
  readonly enabled: boolean
  readonly id: string
  readonly user: UserResponse
  readonly revoked?: boolean | undefined
  readonly expire_behavior?: IntegrationExpireBehaviorTypes | undefined
  readonly expire_grace_period?: IntegrationExpireGracePeriodTypes | undefined
  readonly subscriber_count?: number | undefined
  readonly synced_at?: string | undefined
  readonly role_id?: SnowflakeType | null | undefined
  readonly syncing?: boolean | undefined
  readonly enable_emoticons?: boolean | undefined
}

export interface GuildSubscriptionIntegrationResponse {
  readonly type: "guild_subscription"
  readonly name?: string | null | undefined
  readonly account: AccountResponse
  readonly enabled: boolean
  readonly id: SnowflakeType
}

export type ListGuildIntegrations200 = ReadonlyArray<
  | DiscordIntegrationResponse
  | ExternalConnectionIntegrationResponse
  | GuildSubscriptionIntegrationResponse
>

export type ListGuildInvites200 = ReadonlyArray<
  FriendInviteResponse | GroupDMInviteResponse | GuildInviteResponse | null
>

export interface ListGuildMembersParams {
  readonly limit?: number | undefined
  readonly after?: number | undefined
}

export type ListGuildMembers200 = ReadonlyArray<GuildMemberResponse>

export interface UpdateMyGuildMemberRequest {
  readonly nick?: string | null | undefined
}

export interface PrivateGuildMemberResponse {
  readonly avatar?: string | null | undefined
  readonly avatar_decoration_data?:
    | UserAvatarDecorationResponse
    | null
    | undefined
  readonly banner?: string | null | undefined
  readonly communication_disabled_until?: string | null | undefined
  readonly flags: number
  readonly joined_at: string
  readonly nick?: string | null | undefined
  readonly pending: boolean
  readonly premium_since?: string | null | undefined
  readonly roles: ReadonlyArray<SnowflakeType>
  readonly collectibles?: UserCollectiblesResponse | null | undefined
  readonly user: UserResponse
  readonly mute: boolean
  readonly deaf: boolean
  readonly permissions?: string | undefined
}

export interface SearchGuildMembersParams {
  readonly limit?: number | undefined
  readonly query: string
}

export type SearchGuildMembers200 = ReadonlyArray<GuildMemberResponse>

export interface BotAddGuildMemberRequest {
  readonly nick?: string | null | undefined
  readonly roles?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly mute?: boolean | null | undefined
  readonly deaf?: boolean | null | undefined
  readonly access_token: string
  readonly flags?: number | null | undefined
}

export interface UpdateGuildMemberRequest {
  readonly nick?: string | null | undefined
  readonly roles?: ReadonlyArray<null | SnowflakeType> | null | undefined
  readonly mute?: boolean | null | undefined
  readonly deaf?: boolean | null | undefined
  readonly channel_id?: SnowflakeType | null | undefined
  readonly communication_disabled_until?: string | null | undefined
  readonly flags?: number | null | undefined
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
  readonly id?: SnowflakeType | null | undefined
  readonly name?: string | null | undefined
  readonly animated: boolean
}

export interface NewMemberActionResponse {
  readonly channel_id: SnowflakeType
  readonly action_type: NewMemberActionType
  readonly title: string
  readonly description: string
  readonly emoji?: SettingsEmojiResponse | undefined
  readonly icon?: string | undefined
}

export interface ResourceChannelResponse {
  readonly channel_id: SnowflakeType
  readonly title: string
  readonly emoji?: SettingsEmojiResponse | undefined
  readonly icon?: string | undefined
  readonly description: string
}

export interface GuildHomeSettingsResponse {
  readonly guild_id: SnowflakeType
  readonly enabled: boolean
  readonly welcome_message?: WelcomeMessageResponse | undefined
  readonly new_member_actions: ReadonlyArray<null | NewMemberActionResponse>
  readonly resource_channels: ReadonlyArray<null | ResourceChannelResponse>
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
  /**
   * Multiple choice options
   */
  MULTIPLE_CHOICE: 0,
  /**
   * Many options shown as a dropdown
   */
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
  readonly id?: SnowflakeType | null | undefined
  readonly title: string
  readonly description?: string | null | undefined
  readonly emoji_id?: SnowflakeType | null | undefined
  readonly emoji_name?: string | null | undefined
  readonly emoji_animated?: boolean | null | undefined
  readonly role_ids?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly channel_ids?: ReadonlyArray<SnowflakeType> | null | undefined
}

export interface UpdateOnboardingPromptRequest {
  readonly title: string
  readonly options: ReadonlyArray<OnboardingPromptOptionRequest>
  readonly single_select?: boolean | null | undefined
  readonly required?: boolean | null | undefined
  readonly in_onboarding?: boolean | null | undefined
  readonly type?: OnboardingPromptType | null | undefined
  readonly id: SnowflakeType
}

export const GuildOnboardingMode = {
  /**
   * Only Default Channels considered in constraints
   */
  ONBOARDING_DEFAULT: 0,
  /**
   * Default Channels and Onboarding Prompts considered in constraints
   */
  ONBOARDING_ADVANCED: 1,
} as const
export type GuildOnboardingMode =
  (typeof GuildOnboardingMode)[keyof typeof GuildOnboardingMode]

export interface UpdateGuildOnboardingRequest {
  readonly prompts?:
    | ReadonlyArray<UpdateOnboardingPromptRequest>
    | null
    | undefined
  readonly enabled?: boolean | null | undefined
  readonly default_channel_ids?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly mode?: GuildOnboardingMode | null | undefined
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
  readonly icon?: string | null | undefined
  readonly description?: string | null | undefined
  readonly home_header?: string | null | undefined
  readonly splash?: string | null | undefined
  readonly discovery_splash?: string | null | undefined
  readonly features: ReadonlyArray<GuildFeatures>
  readonly approximate_member_count: number
  readonly approximate_presence_count: number
  readonly emojis: ReadonlyArray<EmojiResponse>
  readonly stickers: ReadonlyArray<GuildStickerResponse>
}

export interface PreviewPruneGuildParams {
  readonly days?: number | undefined
  readonly include_roles?:
    | string
    | ReadonlyArray<null | SnowflakeType>
    | undefined
}

export interface GuildPruneResponse {
  readonly pruned?: number | null | undefined
}

export interface PruneGuildRequest {
  readonly days?: number | null | undefined
  readonly compute_prune_count?: boolean | null | undefined
  readonly include_roles?:
    | string
    | ReadonlyArray<SnowflakeType>
    | null
    | undefined
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

export interface CreateRoleRequest {
  readonly name?: string | null | undefined
  readonly permissions?: number | null | undefined
  readonly color?: number | null | undefined
  readonly hoist?: boolean | null | undefined
  readonly mentionable?: boolean | null | undefined
  readonly icon?: string | null | undefined
  readonly unicode_emoji?: string | null | undefined
}

export interface UpdateRolePositionsRequest {
  readonly id?: SnowflakeType | null | undefined
  readonly position?: number | null | undefined
}

export type BulkUpdateGuildRolesRequest =
  ReadonlyArray<UpdateRolePositionsRequest>

export type BulkUpdateGuildRoles200 = ReadonlyArray<GuildRoleResponse>

export interface UpdateRoleRequestPartial {
  readonly name?: string | null | undefined
  readonly permissions?: number | null | undefined
  readonly color?: number | null | undefined
  readonly hoist?: boolean | null | undefined
  readonly mentionable?: boolean | null | undefined
  readonly icon?: string | null | undefined
  readonly unicode_emoji?: string | null | undefined
}

export interface ListGuildScheduledEventsParams {
  readonly with_user_count?: boolean | undefined
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
  readonly description?: string | null | undefined
  readonly image?: string | null | undefined
  readonly scheduled_start_time: string
  readonly scheduled_end_time?: string | null | undefined
  readonly privacy_level: GuildScheduledEventPrivacyLevels
  readonly entity_type: 3
  readonly channel_id?: SnowflakeType | null | undefined
  readonly entity_metadata: EntityMetadataExternal
}

export interface EntityMetadataStageInstance {}

export interface StageScheduledEventCreateRequest {
  readonly name: string
  readonly description?: string | null | undefined
  readonly image?: string | null | undefined
  readonly scheduled_start_time: string
  readonly scheduled_end_time?: string | null | undefined
  readonly privacy_level: GuildScheduledEventPrivacyLevels
  readonly entity_type: 1
  readonly channel_id?: SnowflakeType | null | undefined
  readonly entity_metadata?: EntityMetadataStageInstance | null | undefined
}

export interface EntityMetadataVoice {}

export interface VoiceScheduledEventCreateRequest {
  readonly name: string
  readonly description?: string | null | undefined
  readonly image?: string | null | undefined
  readonly scheduled_start_time: string
  readonly scheduled_end_time?: string | null | undefined
  readonly privacy_level: GuildScheduledEventPrivacyLevels
  readonly entity_type: 2
  readonly channel_id?: SnowflakeType | null | undefined
  readonly entity_metadata?: EntityMetadataVoice | null | undefined
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
  readonly with_user_count?: boolean | undefined
}

export type GetGuildScheduledEvent200 =
  | ExternalScheduledEventResponse
  | StageScheduledEventResponse
  | VoiceScheduledEventResponse

export interface ExternalScheduledEventPatchRequestPartial {
  readonly status?: GuildScheduledEventStatuses | null | undefined
  readonly name?: string | undefined
  readonly description?: string | null | undefined
  readonly image?: string | null | undefined
  readonly scheduled_start_time?: string | undefined
  readonly scheduled_end_time?: string | null | undefined
  readonly entity_type?: 3 | null | undefined
  readonly privacy_level?: GuildScheduledEventPrivacyLevels | undefined
  readonly channel_id?: SnowflakeType | null | undefined
  readonly entity_metadata?: EntityMetadataExternal | undefined
}

export interface StageScheduledEventPatchRequestPartial {
  readonly status?: GuildScheduledEventStatuses | null | undefined
  readonly name?: string | undefined
  readonly description?: string | null | undefined
  readonly image?: string | null | undefined
  readonly scheduled_start_time?: string | undefined
  readonly scheduled_end_time?: string | null | undefined
  readonly entity_type?: 1 | null | undefined
  readonly privacy_level?: GuildScheduledEventPrivacyLevels | undefined
  readonly channel_id?: SnowflakeType | null | undefined
  readonly entity_metadata?: EntityMetadataStageInstance | null | undefined
}

export interface VoiceScheduledEventPatchRequestPartial {
  readonly status?: GuildScheduledEventStatuses | null | undefined
  readonly name?: string | undefined
  readonly description?: string | null | undefined
  readonly image?: string | null | undefined
  readonly scheduled_start_time?: string | undefined
  readonly scheduled_end_time?: string | null | undefined
  readonly entity_type?: 2 | null | undefined
  readonly privacy_level?: GuildScheduledEventPrivacyLevels | undefined
  readonly channel_id?: SnowflakeType | null | undefined
  readonly entity_metadata?: EntityMetadataVoice | null | undefined
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
  readonly with_member?: boolean | undefined
  readonly limit?: number | undefined
  readonly before?: SnowflakeType | undefined
  readonly after?: SnowflakeType | undefined
}

export type ListGuildScheduledEventUsers200 =
  ReadonlyArray<ScheduledEventUserResponse>

export interface SoundboardSoundResponse {
  readonly name: string
  readonly sound_id: SnowflakeType
  readonly volume: number
  readonly emoji_id?: SnowflakeType | null | undefined
  readonly emoji_name?: string | null | undefined
  readonly guild_id?: SnowflakeType | undefined
  readonly available: boolean
  readonly user?: UserResponse | undefined
}

export interface ListGuildSoundboardSoundsResponse {
  readonly items: ReadonlyArray<SoundboardSoundResponse>
}

export interface SoundboardCreateRequest {
  readonly name: string
  readonly volume?: number | null | undefined
  readonly emoji_id?: SnowflakeType | null | undefined
  readonly emoji_name?: string | null | undefined
  readonly sound: string
}

export interface SoundboardPatchRequestPartial {
  readonly name?: string | undefined
  readonly volume?: number | null | undefined
  readonly emoji_id?: SnowflakeType | null | undefined
  readonly emoji_name?: string | null | undefined
}

export type ListGuildStickers200 = ReadonlyArray<GuildStickerResponse>

export interface CreateGuildStickerRequest {
  readonly name: string
  readonly tags: string
  readonly description?: string | null | undefined
  readonly file: Blob
}

export interface UpdateGuildStickerRequest {
  readonly name?: string | undefined
  readonly tags?: string | undefined
  readonly description?: string | null | undefined
}

export type ListGuildTemplates200 = ReadonlyArray<GuildTemplateResponse>

export interface CreateGuildTemplateRequest {
  readonly name: string
  readonly description?: string | null | undefined
}

export interface UpdateGuildTemplateRequest {
  readonly name?: string | undefined
  readonly description?: string | null | undefined
}

export interface VanityURLErrorResponse {
  readonly message: string
  readonly code: number
}

export interface VanityURLResponse {
  readonly code?: string | null | undefined
  readonly uses: number
  readonly error?: VanityURLErrorResponse | null | undefined
}

export interface VoiceStateResponse {
  readonly channel_id?: SnowflakeType | null | undefined
  readonly deaf: boolean
  readonly guild_id?: SnowflakeType | null | undefined
  readonly member?: GuildMemberResponse | undefined
  readonly mute: boolean
  readonly request_to_speak_timestamp?: string | null | undefined
  readonly suppress: boolean
  readonly self_stream?: boolean | null | undefined
  readonly self_deaf: boolean
  readonly self_mute: boolean
  readonly self_video: boolean
  readonly session_id: string
  readonly user_id: SnowflakeType
}

export interface UpdateSelfVoiceStateRequestPartial {
  readonly request_to_speak_timestamp?: string | null | undefined
  readonly suppress?: boolean | null | undefined
  readonly channel_id?: SnowflakeType | null | undefined
}

export interface UpdateVoiceStateRequestPartial {
  readonly suppress?: boolean | null | undefined
  readonly channel_id?: SnowflakeType | null | undefined
}

export type GetGuildWebhooks200 = ReadonlyArray<
  | ApplicationIncomingWebhookResponse
  | ChannelFollowerWebhookResponse
  | GuildIncomingWebhookResponse
>

export interface GuildWelcomeScreenChannelResponse {
  readonly channel_id: SnowflakeType
  readonly description: string
  readonly emoji_id?: SnowflakeType | null | undefined
  readonly emoji_name?: string | null | undefined
}

export interface GuildWelcomeScreenResponse {
  readonly description?: string | null | undefined
  readonly welcome_channels: ReadonlyArray<GuildWelcomeScreenChannelResponse>
}

export interface GuildWelcomeChannel {
  readonly channel_id: SnowflakeType
  readonly description: string
  readonly emoji_id?: SnowflakeType | null | undefined
  readonly emoji_name?: string | null | undefined
}

export interface WelcomeScreenPatchRequestPartial {
  readonly description?: string | null | undefined
  readonly welcome_channels?:
    | ReadonlyArray<GuildWelcomeChannel>
    | null
    | undefined
  readonly enabled?: boolean | null | undefined
}

export interface WidgetSettingsResponse {
  readonly enabled: boolean
  readonly channel_id?: SnowflakeType | null | undefined
}

export interface UpdateGuildWidgetSettingsRequest {
  readonly channel_id?: SnowflakeType | null | undefined
  readonly enabled?: boolean | null | undefined
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
  readonly avatar?: null | undefined
  readonly status: string
  readonly avatar_url: string
  readonly activity?: WidgetActivity | undefined
  readonly deaf?: boolean | undefined
  readonly mute?: boolean | undefined
  readonly self_deaf?: boolean | undefined
  readonly self_mute?: boolean | undefined
  readonly suppress?: boolean | undefined
  readonly channel_id?: SnowflakeType | undefined
}

export interface WidgetResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly instant_invite?: string | null | undefined
  readonly channels: ReadonlyArray<WidgetChannel>
  readonly members: ReadonlyArray<WidgetMember>
  readonly presence_count: number
}

export const WidgetImageStyles = {
  /**
   * shield style widget with Discord icon and guild members online count
   */
  SHIELD: "shield",
  /**
   * large image with guild icon, name and online count. "POWERED BY DISCORD" as the footer of the widget
   */
  BANNER1: "banner1",
  /**
   * smaller widget style with guild icon, name and online count. Split on the right with Discord logo
   */
  BANNER2: "banner2",
  /**
   * large image with guild icon, name and online count. In the footer, Discord logo on the left and "Chat Now" on the right
   */
  BANNER3: "banner3",
  /**
   * large Discord logo at the top of the widget. Guild icon, name and online count in the middle portion of the widget and a "JOIN MY SERVER" button at the bottom
   */
  BANNER4: "banner4",
} as const
export type WidgetImageStyles =
  (typeof WidgetImageStyles)[keyof typeof WidgetImageStyles]

export interface GetGuildWidgetPngParams {
  readonly style?: WidgetImageStyles | undefined
}

export interface CreateInteractionResponseParams {
  readonly with_response?: boolean | undefined
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
  readonly choices?:
    | ReadonlyArray<null | ApplicationCommandOptionIntegerChoice>
    | null
    | undefined
}

export interface InteractionApplicationCommandAutocompleteCallbackNumberData {
  readonly choices?:
    | ReadonlyArray<null | ApplicationCommandOptionNumberChoice>
    | null
    | undefined
}

export interface InteractionApplicationCommandAutocompleteCallbackStringData {
  readonly choices?:
    | ReadonlyArray<null | ApplicationCommandOptionStringChoice>
    | null
    | undefined
}

export interface ApplicationCommandAutocompleteCallbackRequest {
  readonly type: 8
  readonly data:
    | InteractionApplicationCommandAutocompleteCallbackIntegerData
    | InteractionApplicationCommandAutocompleteCallbackNumberData
    | InteractionApplicationCommandAutocompleteCallbackStringData
}

export interface IncomingWebhookInteractionRequest {
  readonly content?: string | null | undefined
  readonly embeds?: ReadonlyArray<RichEmbed> | null | undefined
  readonly allowed_mentions?: MessageAllowedMentionsRequest | null | undefined
  readonly components?:
    | ReadonlyArray<
        | ActionRowComponentForMessageRequest
        | ContainerComponentForMessageRequest
        | FileComponentForMessageRequest
        | MediaGalleryComponentForMessageRequest
        | SectionComponentForMessageRequest
        | SeparatorComponentForMessageRequest
        | TextDisplayComponentForMessageRequest
      >
    | null
    | undefined
  readonly attachments?:
    | ReadonlyArray<MessageAttachmentRequest>
    | null
    | undefined
  readonly poll?: PollCreateRequest | null | undefined
  readonly tts?: boolean | null | undefined
  readonly flags?: number | null | undefined
}

export interface CreateMessageInteractionCallbackRequest {
  readonly type: 4 | 5
  readonly data?: IncomingWebhookInteractionRequest | null | undefined
}

export interface LaunchActivityInteractionCallbackRequest {
  readonly type: 12
}

export interface TextInputComponentForModalRequest {
  readonly type: 4
  readonly id?: number | null | undefined
  readonly custom_id: string
  readonly style: TextInputStyleTypes
  readonly label?: string | null | undefined
  readonly value?: string | null | undefined
  readonly placeholder?: string | null | undefined
  readonly required?: boolean | null | undefined
  readonly min_length?: number | null | undefined
  readonly max_length?: number | null | undefined
}

export interface ActionRowComponentForModalRequest {
  readonly type: 1
  readonly id?: number | null | undefined
  readonly components: ReadonlyArray<TextInputComponentForModalRequest>
}

export interface ChannelSelectComponentForModalRequest {
  readonly type: 8
  readonly id?: number | null | undefined
  readonly custom_id: string
  readonly placeholder?: string | null | undefined
  readonly min_values?: number | null | undefined
  readonly max_values?: number | null | undefined
  readonly disabled?: boolean | null | undefined
  readonly required?: boolean | null | undefined
  readonly default_values?:
    | ReadonlyArray<ChannelSelectDefaultValue>
    | null
    | undefined
  readonly channel_types?: ReadonlyArray<ChannelTypes> | null | undefined
}

export interface FileUploadComponentForModalRequest {
  readonly type: 19
  readonly id?: number | null | undefined
  readonly custom_id: string
  readonly min_values?: number | null | undefined
  readonly max_values?: number | null | undefined
  readonly required?: boolean | null | undefined
}

export interface MentionableSelectComponentForModalRequest {
  readonly type: 7
  readonly id?: number | null | undefined
  readonly custom_id: string
  readonly placeholder?: string | null | undefined
  readonly min_values?: number | null | undefined
  readonly max_values?: number | null | undefined
  readonly disabled?: boolean | null | undefined
  readonly required?: boolean | null | undefined
  readonly default_values?:
    | ReadonlyArray<RoleSelectDefaultValue | UserSelectDefaultValue>
    | null
    | undefined
}

export interface RoleSelectComponentForModalRequest {
  readonly type: 6
  readonly id?: number | null | undefined
  readonly custom_id: string
  readonly placeholder?: string | null | undefined
  readonly min_values?: number | null | undefined
  readonly max_values?: number | null | undefined
  readonly disabled?: boolean | null | undefined
  readonly required?: boolean | null | undefined
  readonly default_values?:
    | ReadonlyArray<RoleSelectDefaultValue>
    | null
    | undefined
}

export interface StringSelectComponentForModalRequest {
  readonly type: 3
  readonly id?: number | null | undefined
  readonly custom_id: string
  readonly placeholder?: string | null | undefined
  readonly min_values?: number | null | undefined
  readonly max_values?: number | null | undefined
  readonly disabled?: boolean | null | undefined
  readonly required?: boolean | null | undefined
  readonly options: ReadonlyArray<StringSelectOptionForRequest>
}

export interface UserSelectComponentForModalRequest {
  readonly type: 5
  readonly id?: number | null | undefined
  readonly custom_id: string
  readonly placeholder?: string | null | undefined
  readonly min_values?: number | null | undefined
  readonly max_values?: number | null | undefined
  readonly disabled?: boolean | null | undefined
  readonly required?: boolean | null | undefined
  readonly default_values?:
    | ReadonlyArray<UserSelectDefaultValue>
    | null
    | undefined
}

export interface LabelComponentForModalRequest {
  readonly type: 18
  readonly id?: number | null | undefined
  readonly label: string
  readonly description?: string | null | undefined
  readonly component:
    | ChannelSelectComponentForModalRequest
    | FileUploadComponentForModalRequest
    | MentionableSelectComponentForModalRequest
    | RoleSelectComponentForModalRequest
    | StringSelectComponentForModalRequest
    | TextInputComponentForModalRequest
    | UserSelectComponentForModalRequest
}

export interface TextDisplayComponentForModalRequest {
  readonly type: 10
  readonly id?: number | null | undefined
  readonly content: string
}

export interface ModalInteractionCallbackRequestData {
  readonly custom_id: string
  readonly title: string
  readonly components: ReadonlyArray<
    | ActionRowComponentForModalRequest
    | LabelComponentForModalRequest
    | TextDisplayComponentForModalRequest
  >
}

export interface ModalInteractionCallbackRequest {
  readonly type: 9
  readonly data: ModalInteractionCallbackRequestData
}

export interface PongInteractionCallbackRequest {
  readonly type: 1
}

export interface IncomingWebhookUpdateForInteractionCallbackRequestPartial {
  readonly content?: string | null | undefined
  readonly embeds?: ReadonlyArray<RichEmbed> | null | undefined
  readonly allowed_mentions?: MessageAllowedMentionsRequest | null | undefined
  readonly components?:
    | ReadonlyArray<
        | ActionRowComponentForMessageRequest
        | ContainerComponentForMessageRequest
        | FileComponentForMessageRequest
        | MediaGalleryComponentForMessageRequest
        | SectionComponentForMessageRequest
        | SeparatorComponentForMessageRequest
        | TextDisplayComponentForMessageRequest
      >
    | null
    | undefined
  readonly attachments?:
    | ReadonlyArray<MessageAttachmentRequest>
    | null
    | undefined
  readonly flags?: number | null | undefined
}

export interface UpdateMessageInteractionCallbackRequest {
  readonly type: 6 | 7
  readonly data?:
    | IncomingWebhookUpdateForInteractionCallbackRequestPartial
    | null
    | undefined
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
  readonly response_message_id?: SnowflakeType | undefined
  readonly response_message_loading?: boolean | undefined
  readonly response_message_ephemeral?: boolean | undefined
  readonly channel_id?: SnowflakeType | undefined
  readonly guild_id?: SnowflakeType | undefined
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
    | undefined
}

export interface InviteResolveParams {
  readonly with_counts?: boolean | undefined
  readonly guild_scheduled_event_id?: SnowflakeType | undefined
}

export type InviteResolve200 =
  | FriendInviteResponse
  | GroupDMInviteResponse
  | GuildInviteResponse

export type InviteRevoke200 =
  | FriendInviteResponse
  | GroupDMInviteResponse
  | GuildInviteResponse

export type CreateOrJoinLobbyRequestFlagsEnum = 1

export interface CreateOrJoinLobbyRequest {
  readonly idle_timeout_seconds?: number | null | undefined
  readonly lobby_metadata?: Record<string, unknown> | null | undefined
  readonly member_metadata?: Record<string, unknown> | null | undefined
  readonly secret: string
  readonly flags?: CreateOrJoinLobbyRequestFlagsEnum | null | undefined
}

export interface LobbyMemberResponse {
  readonly id: SnowflakeType
  readonly metadata?: Record<string, unknown> | null | undefined
  readonly flags: number
}

export interface LobbyResponse {
  readonly id: SnowflakeType
  readonly application_id: SnowflakeType
  readonly metadata?: Record<string, unknown> | null | undefined
  readonly members: ReadonlyArray<LobbyMemberResponse>
  readonly linked_channel?: GuildChannelResponse | undefined
  readonly flags: UInt32Type
  readonly override_event_webhooks_url?: string | null | undefined
}

export type LobbyMemberRequestFlagsEnum = 1

export interface LobbyMemberRequest {
  readonly id: SnowflakeType
  readonly metadata?: Record<string, unknown> | null | undefined
  readonly flags?: LobbyMemberRequestFlagsEnum | null | undefined
}

export type CreateLobbyRequestFlagsEnum = 1

export interface CreateLobbyRequest {
  readonly idle_timeout_seconds?: number | null | undefined
  readonly members?: ReadonlyArray<LobbyMemberRequest> | null | undefined
  readonly metadata?: Record<string, unknown> | null | undefined
  readonly flags?: CreateLobbyRequestFlagsEnum | null | undefined
  readonly override_event_webhooks_url?: string | null | undefined
}

export type EditLobbyRequestFlagsEnum = 1

export interface EditLobbyRequest {
  readonly idle_timeout_seconds?: number | null | undefined
  readonly metadata?: Record<string, unknown> | null | undefined
  readonly members?: ReadonlyArray<LobbyMemberRequest> | null | undefined
  readonly flags?: EditLobbyRequestFlagsEnum | null | undefined
  readonly override_event_webhooks_url?: string | null | undefined
}

export interface EditLobbyChannelLinkRequest {
  readonly channel_id?: SnowflakeType | null | undefined
}

export interface LobbyGuildInviteResponse {
  readonly code: string
}

export type BulkLobbyMemberRequestFlagsEnum = 1

export interface BulkLobbyMemberRequest {
  readonly id: SnowflakeType
  readonly metadata?: Record<string, unknown> | null | undefined
  readonly flags?: BulkLobbyMemberRequestFlagsEnum | null | undefined
  readonly remove_member?: boolean | null | undefined
}

export type BulkUpdateLobbyMembersRequest =
  ReadonlyArray<BulkLobbyMemberRequest>

export type BulkUpdateLobbyMembers200 = ReadonlyArray<LobbyMemberResponse>

export type AddLobbyMemberRequestFlagsEnum = 1

export interface AddLobbyMemberRequest {
  readonly metadata?: Record<string, unknown> | null | undefined
  readonly flags?: AddLobbyMemberRequestFlagsEnum | null | undefined
}

export interface GetLobbyMessagesParams {
  readonly limit?: number | undefined
}

export interface LobbyMessageResponse {
  readonly id: SnowflakeType
  readonly type: MessageType
  readonly content: string
  readonly lobby_id: SnowflakeType
  readonly channel_id: SnowflakeType
  readonly author: UserResponse
  readonly metadata?: Record<string, unknown> | undefined
  readonly flags: number
  readonly application_id?: SnowflakeType | undefined
}

export type GetLobbyMessages200 = ReadonlyArray<LobbyMessageResponse>

export interface SDKMessageRequest {
  readonly content?: string | null | undefined
  readonly embeds?: ReadonlyArray<RichEmbed> | null | undefined
  readonly allowed_mentions?: MessageAllowedMentionsRequest | null | undefined
  readonly sticker_ids?: ReadonlyArray<SnowflakeType> | null | undefined
  readonly components?:
    | ReadonlyArray<
        | ActionRowComponentForMessageRequest
        | ContainerComponentForMessageRequest
        | FileComponentForMessageRequest
        | MediaGalleryComponentForMessageRequest
        | SectionComponentForMessageRequest
        | SeparatorComponentForMessageRequest
        | TextDisplayComponentForMessageRequest
      >
    | null
    | undefined
  readonly flags?: number | null | undefined
  readonly attachments?:
    | ReadonlyArray<MessageAttachmentRequest>
    | null
    | undefined
  readonly poll?: PollCreateRequest | null | undefined
  readonly shared_client_theme?:
    | CustomClientThemeShareRequest
    | null
    | undefined
  readonly confetti_potion?: ConfettiPotionCreateRequest | null | undefined
  readonly message_reference?: MessageReferenceRequest | null | undefined
  readonly nonce?: number | string | null | undefined
  readonly enforce_nonce?: boolean | null | undefined
  readonly tts?: boolean | null | undefined
}

export interface OAuth2GetAuthorizationResponse {
  readonly application: ApplicationResponse
  readonly expires: string
  readonly scopes: ReadonlyArray<OAuth2Scopes>
  readonly user?: UserResponse | undefined
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
  readonly email?: string | null | undefined
  readonly email_verified?: boolean | undefined
  readonly preferred_username?: string | undefined
  readonly nickname?: string | null | undefined
  readonly picture?: string | undefined
  readonly locale?: string | undefined
}

export const ApplicationIdentityProviderAuthType = {
  OIDC: "OIDC",
  EPIC_ONLINE_SERVICES_ACCESS_TOKEN: "EPIC_ONLINE_SERVICES_ACCESS_TOKEN",
  EPIC_ONLINE_SERVICES_ID_TOKEN: "EPIC_ONLINE_SERVICES_ID_TOKEN",
  STEAM_SESSION_TICKET: "STEAM_SESSION_TICKET",
  UNITY_SERVICES_ID_TOKEN: "UNITY_SERVICES_ID_TOKEN",
  DISCORD_BOT_ISSUED_ACCESS_TOKEN: "DISCORD_BOT_ISSUED_ACCESS_TOKEN",
  APPLE_ID_TOKEN: "APPLE_ID_TOKEN",
  PLAYSTATION_NETWORK_ID_TOKEN: "PLAYSTATION_NETWORK_ID_TOKEN",
} as const
export type ApplicationIdentityProviderAuthType =
  (typeof ApplicationIdentityProviderAuthType)[keyof typeof ApplicationIdentityProviderAuthType]

export interface PartnerSdkUnmergeProvisionalAccountRequest {
  readonly client_id: SnowflakeType
  readonly client_secret?: string | null | undefined
  readonly external_auth_token: string
  readonly external_auth_type: ApplicationIdentityProviderAuthType
}

export interface BotPartnerSdkUnmergeProvisionalAccountRequest {
  readonly external_user_id: string
}

export interface PartnerSdkTokenRequest {
  readonly client_id: SnowflakeType
  readonly client_secret?: string | null | undefined
  readonly external_auth_token: string
  readonly external_auth_type: ApplicationIdentityProviderAuthType
}

export interface ProvisionalTokenResponse {
  readonly token_type: string
  readonly access_token: string
  readonly expires_in: number
  readonly scope: string
  readonly id_token: string
  readonly refresh_token?: string | null | undefined
  readonly scopes?: ReadonlyArray<string> | null | undefined
  readonly expires_at_s?: number | null | undefined
}

export interface BotPartnerSdkTokenRequest {
  readonly external_user_id: string
  readonly preferred_global_name?: string | null | undefined
}

export type GetSoundboardDefaultSounds200 =
  ReadonlyArray<SoundboardSoundResponse>

export const StageInstancesPrivacyLevels = {
  /**
   * The Stage instance is visible publicly. (deprecated)
   */
  PUBLIC: 1,
  /**
   * The Stage instance is visible publicly. (deprecated)
   */
  GUILD_ONLY: 2,
} as const
export type StageInstancesPrivacyLevels =
  (typeof StageInstancesPrivacyLevels)[keyof typeof StageInstancesPrivacyLevels]

export interface CreateStageInstanceRequest {
  readonly topic: string
  readonly channel_id: SnowflakeType
  readonly privacy_level?: StageInstancesPrivacyLevels | null | undefined
  readonly guild_scheduled_event_id?: SnowflakeType | null | undefined
  readonly send_start_notification?: boolean | null | undefined
}

export interface StageInstanceResponse {
  readonly guild_id: SnowflakeType
  readonly channel_id: SnowflakeType
  readonly topic: string
  readonly privacy_level: StageInstancesPrivacyLevels
  readonly id: SnowflakeType
  readonly discoverable_disabled: boolean
  readonly guild_scheduled_event_id?: SnowflakeType | null | undefined
}

export interface UpdateStageInstanceRequest {
  readonly topic?: string | undefined
  readonly privacy_level?: StageInstancesPrivacyLevels | undefined
}

export interface StickerPackResponse {
  readonly id: SnowflakeType
  readonly sku_id: SnowflakeType
  readonly name: string
  readonly description?: string | null | undefined
  readonly stickers: ReadonlyArray<StandardStickerResponse>
  readonly cover_sticker_id?: SnowflakeType | undefined
  readonly banner_asset_id?: SnowflakeType | undefined
}

export interface StickerPackCollectionResponse {
  readonly sticker_packs: ReadonlyArray<StickerPackResponse>
}

export type GetSticker200 = GuildStickerResponse | StandardStickerResponse

export const PremiumTypes = {
  /**
   * None
   */
  NONE: 0,
  /**
   * Nitro Classic
   */
  TIER_1: 1,
  /**
   * Nitro Standard
   */
  TIER_2: 2,
  /**
   * Nitro Basic
   */
  TIER_0: 3,
} as const
export type PremiumTypes = (typeof PremiumTypes)[keyof typeof PremiumTypes]

export interface UserPIIResponse {
  readonly id: SnowflakeType
  readonly username: string
  readonly avatar?: string | null | undefined
  readonly discriminator: string
  readonly public_flags: number
  readonly flags: Int53Type
  readonly bot?: boolean | undefined
  readonly system?: boolean | undefined
  readonly banner?: string | null | undefined
  readonly accent_color?: number | null | undefined
  readonly global_name?: string | null | undefined
  readonly avatar_decoration_data?:
    | UserAvatarDecorationResponse
    | null
    | undefined
  readonly collectibles?: UserCollectiblesResponse | null | undefined
  readonly primary_guild?: UserPrimaryGuildResponse | null | undefined
  readonly mfa_enabled: boolean
  readonly locale: AvailableLocalesEnum
  readonly premium_type?: PremiumTypes | undefined
  readonly email?: string | null | undefined
  readonly verified?: boolean | undefined
}

export interface BotAccountPatchRequest {
  readonly username: string
  readonly avatar?: string | null | undefined
  readonly banner?: string | null | undefined
}

export interface ApplicationUserRoleConnectionResponse {
  readonly platform_name?: string | null | undefined
  readonly platform_username?: string | null | undefined
  readonly metadata?: Record<string, unknown> | undefined
}

export interface UpdateApplicationUserRoleConnectionRequest {
  readonly platform_name?: string | null | undefined
  readonly platform_username?: string | null | undefined
  readonly metadata?: Record<string, unknown> | null | undefined
}

export interface CreatePrivateChannelRequest {
  readonly recipient_id?: SnowflakeType | null | undefined
  readonly access_tokens?: ReadonlyArray<string> | null | undefined
  readonly nicks?: Record<string, unknown> | null | undefined
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
  readonly icon?: string | null | undefined
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
  readonly name?: string | null | undefined
  readonly type: ConnectedAccountProviders
  readonly friend_sync: boolean
  readonly integrations?:
    | ReadonlyArray<ConnectedAccountIntegrationResponse>
    | undefined
  readonly show_activity: boolean
  readonly two_way_link: boolean
  readonly verified: boolean
  readonly visibility: ConnectedAccountVisibility
  readonly revoked?: boolean | undefined
}

export type ListMyConnections200 = ReadonlyArray<ConnectedAccountResponse>

export interface ListMyGuildsParams {
  readonly before?: SnowflakeType | undefined
  readonly after?: SnowflakeType | undefined
  readonly limit?: number | undefined
  readonly with_counts?: boolean | undefined
}

export interface MyGuildResponse {
  readonly id: SnowflakeType
  readonly name: string
  readonly icon?: string | null | undefined
  readonly banner?: string | null | undefined
  readonly owner: boolean
  readonly permissions: string
  readonly features: ReadonlyArray<GuildFeatures>
  readonly approximate_member_count?: number | null | undefined
  readonly approximate_presence_count?: number | null | undefined
}

export type ListMyGuilds200 = ReadonlyArray<MyGuildResponse>

export type ListVoiceRegions200 = ReadonlyArray<VoiceRegionResponse>

export type GetWebhook200 =
  | ApplicationIncomingWebhookResponse
  | ChannelFollowerWebhookResponse
  | GuildIncomingWebhookResponse

export interface UpdateWebhookRequest {
  readonly name?: string | undefined
  readonly avatar?: string | null | undefined
  readonly channel_id?: SnowflakeType | null | undefined
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
  readonly wait?: boolean | undefined
  readonly thread_id?: SnowflakeType | undefined
  readonly with_components?: boolean | undefined
}

export interface IncomingWebhookRequestPartial {
  readonly content?: string | null | undefined
  readonly embeds?: ReadonlyArray<RichEmbed> | null | undefined
  readonly allowed_mentions?: MessageAllowedMentionsRequest | null | undefined
  readonly components?:
    | ReadonlyArray<
        | ActionRowComponentForMessageRequest
        | ContainerComponentForMessageRequest
        | FileComponentForMessageRequest
        | MediaGalleryComponentForMessageRequest
        | SectionComponentForMessageRequest
        | SeparatorComponentForMessageRequest
        | TextDisplayComponentForMessageRequest
      >
    | null
    | undefined
  readonly attachments?:
    | ReadonlyArray<MessageAttachmentRequest>
    | null
    | undefined
  readonly poll?: PollCreateRequest | null | undefined
  readonly tts?: boolean | null | undefined
  readonly flags?: number | null | undefined
  readonly username?: string | null | undefined
  readonly avatar_url?: string | null | undefined
  readonly thread_name?: string | null | undefined
  readonly applied_tags?: ReadonlyArray<SnowflakeType> | null | undefined
}

export interface IncomingWebhookUpdateRequestPartial {
  readonly content?: string | null | undefined
  readonly embeds?: ReadonlyArray<RichEmbed> | null | undefined
  readonly allowed_mentions?: MessageAllowedMentionsRequest | null | undefined
  readonly components?:
    | ReadonlyArray<
        | ActionRowComponentForMessageRequest
        | ContainerComponentForMessageRequest
        | FileComponentForMessageRequest
        | MediaGalleryComponentForMessageRequest
        | SectionComponentForMessageRequest
        | SeparatorComponentForMessageRequest
        | TextDisplayComponentForMessageRequest
      >
    | null
    | undefined
  readonly attachments?:
    | ReadonlyArray<MessageAttachmentRequest>
    | null
    | undefined
  readonly poll?: PollCreateRequest | null | undefined
  readonly flags?: number | null | undefined
}

export type ExecuteWebhookRequest =
  | IncomingWebhookRequestPartial
  | IncomingWebhookUpdateRequestPartial

export interface UpdateWebhookByTokenRequest {
  readonly name?: string | undefined
  readonly avatar?: string | null | undefined
}

export type UpdateWebhookByToken200 =
  | ApplicationIncomingWebhookResponse
  | ChannelFollowerWebhookResponse
  | GuildIncomingWebhookResponse

export interface ExecuteGithubCompatibleWebhookParams {
  readonly wait?: boolean | undefined
  readonly thread_id?: SnowflakeType | undefined
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
  readonly commit_id?: string | null | undefined
  readonly body: string
}

export interface GithubIssue {
  readonly id: number
  readonly number: number
  readonly html_url: string
  readonly user: GithubUser
  readonly title: string
  readonly body?: string | null | undefined
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
  readonly username?: string | null | undefined
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
  readonly body?: string | null | undefined
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
  readonly conclusion?: string | null | undefined
  readonly head_branch?: string | null | undefined
  readonly head_sha: string
  readonly pull_requests?:
    | ReadonlyArray<GithubCheckPullRequest>
    | null
    | undefined
  readonly app: GithubCheckApp
}

export interface GithubCheckRunOutput {
  readonly title?: string | null | undefined
  readonly summary?: string | null | undefined
}

export interface GithubCheckRun {
  readonly conclusion?: string | null | undefined
  readonly name: string
  readonly html_url: string
  readonly check_suite: GithubCheckSuite
  readonly details_url?: string | null | undefined
  readonly output?: GithubCheckRunOutput | null | undefined
  readonly pull_requests?:
    | ReadonlyArray<GithubCheckPullRequest>
    | null
    | undefined
}

export interface GithubDiscussion {
  readonly title: string
  readonly number: number
  readonly html_url: string
  readonly answer_html_url?: string | null | undefined
  readonly body?: string | null | undefined
  readonly user: GithubUser
}

export interface GithubWebhook {
  readonly action?: string | null | undefined
  readonly ref?: string | null | undefined
  readonly ref_type?: string | null | undefined
  readonly comment?: GithubComment | null | undefined
  readonly issue?: GithubIssue | null | undefined
  readonly pull_request?: GithubIssue | null | undefined
  readonly repository?: GithubRepository | null | undefined
  readonly forkee?: GithubRepository | null | undefined
  readonly sender: GithubUser
  readonly member?: GithubUser | null | undefined
  readonly release?: GithubRelease | null | undefined
  readonly head_commit?: GithubCommit | null | undefined
  readonly commits?: ReadonlyArray<GithubCommit> | null | undefined
  readonly forced?: boolean | null | undefined
  readonly compare?: string | null | undefined
  readonly review?: GithubReview | null | undefined
  readonly check_run?: GithubCheckRun | null | undefined
  readonly check_suite?: GithubCheckSuite | null | undefined
  readonly discussion?: GithubDiscussion | null | undefined
  readonly answer?: GithubComment | null | undefined
}

export interface GetOriginalWebhookMessageParams {
  readonly thread_id?: SnowflakeType | undefined
}

export interface DeleteOriginalWebhookMessageParams {
  readonly thread_id?: SnowflakeType | undefined
}

export interface UpdateOriginalWebhookMessageParams {
  readonly thread_id?: SnowflakeType | undefined
  readonly with_components?: boolean | undefined
}

export interface GetWebhookMessageParams {
  readonly thread_id?: SnowflakeType | undefined
}

export interface DeleteWebhookMessageParams {
  readonly thread_id?: SnowflakeType | undefined
}

export interface UpdateWebhookMessageParams {
  readonly thread_id?: SnowflakeType | undefined
  readonly with_components?: boolean | undefined
}

export interface ExecuteSlackCompatibleWebhookParams {
  readonly wait?: boolean | undefined
  readonly thread_id?: SnowflakeType | undefined
}

export interface WebhookSlackEmbedField {
  readonly name?: string | null | undefined
  readonly value?: string | null | undefined
  readonly inline?: boolean | null | undefined
}

export interface WebhookSlackEmbed {
  readonly title?: string | null | undefined
  readonly title_link?: string | null | undefined
  readonly text?: string | null | undefined
  readonly color?: string | null | undefined
  readonly ts?: number | null | undefined
  readonly pretext?: string | null | undefined
  readonly footer?: string | null | undefined
  readonly footer_icon?: string | null | undefined
  readonly author_name?: string | null | undefined
  readonly author_link?: string | null | undefined
  readonly author_icon?: string | null | undefined
  readonly image_url?: string | null | undefined
  readonly thumb_url?: string | null | undefined
  readonly fields?: ReadonlyArray<WebhookSlackEmbedField> | null | undefined
}

export interface SlackWebhook {
  readonly text?: string | null | undefined
  readonly username?: string | null | undefined
  readonly icon_url?: string | null | undefined
  readonly attachments?: ReadonlyArray<WebhookSlackEmbed> | null | undefined
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
      Effect.orElseSucceed(response.json, () => "Unexpected status code"),
      description =>
        Effect.fail(
          new HttpClientError.ResponseError({
            request: response.request,
            response,
            reason: "StatusCode",
            description:
              typeof description === "string"
                ? description
                : JSON.stringify(description),
          }),
        ),
    )
  const withResponse: <A, E>(
    f: (response: HttpClientResponse.HttpClientResponse) => Effect.Effect<A, E>,
  ) => (
    request: HttpClientRequest.HttpClientRequest,
  ) => Effect.Effect<any, any> = options.transformClient
    ? f => request =>
        Effect.flatMap(
          Effect.flatMap(options.transformClient!(httpClient), client =>
            client.execute(request),
          ),
          f,
        )
    : f => request => Effect.flatMap(httpClient.execute(request), f)
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
        cause => Effect.fail(DiscordRestError(tag, cause, response)),
      )
  const onRequest = (
    successCodes: ReadonlyArray<string>,
    errorCodes?: Record<string, string>,
  ) => {
    const cases: any = { orElse: unexpectedStatus }
    for (const code of successCodes) {
      cases[code] = decodeSuccess
    }
    if (errorCodes) {
      for (const [code, tag] of Object.entries(errorCodes)) {
        cases[code] = decodeError(tag)
      }
    }
    if (successCodes.length === 0) {
      cases["2xx"] = decodeVoid
    }
    return withResponse(HttpClientResponse.matchStatus(cases) as any)
  }
  return {
    httpClient,
    getMyApplication: () =>
      HttpClientRequest.get(`/applications/@me`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    updateMyApplication: options =>
      HttpClientRequest.patch(`/applications/@me`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getApplication: applicationId =>
      HttpClientRequest.get(`/applications/${applicationId}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    updateApplication: (applicationId, options) =>
      HttpClientRequest.patch(`/applications/${applicationId}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    applicationsGetActivityInstance: (applicationId, instanceId) =>
      HttpClientRequest.get(
        `/applications/${applicationId}/activity-instances/${instanceId}`,
      ).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    uploadApplicationAttachment: (applicationId, options) =>
      HttpClientRequest.post(`/applications/${applicationId}/attachment`).pipe(
        HttpClientRequest.bodyFormDataRecord(options as any),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listApplicationCommands: (applicationId, options) =>
      HttpClientRequest.get(`/applications/${applicationId}/commands`).pipe(
        HttpClientRequest.setUrlParams({
          with_localizations: options?.["with_localizations"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    bulkSetApplicationCommands: (applicationId, options) =>
      HttpClientRequest.put(`/applications/${applicationId}/commands`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createApplicationCommand: (applicationId, options) =>
      HttpClientRequest.post(`/applications/${applicationId}/commands`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["200", "201"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getApplicationCommand: (applicationId, commandId) =>
      HttpClientRequest.get(
        `/applications/${applicationId}/commands/${commandId}`,
      ).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteApplicationCommand: (applicationId, commandId) =>
      HttpClientRequest.del(
        `/applications/${applicationId}/commands/${commandId}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    updateApplicationCommand: (applicationId, commandId, options) =>
      HttpClientRequest.patch(
        `/applications/${applicationId}/commands/${commandId}`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listApplicationEmojis: applicationId =>
      HttpClientRequest.get(`/applications/${applicationId}/emojis`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createApplicationEmoji: (applicationId, options) =>
      HttpClientRequest.post(`/applications/${applicationId}/emojis`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getApplicationEmoji: (applicationId, emojiId) =>
      HttpClientRequest.get(
        `/applications/${applicationId}/emojis/${emojiId}`,
      ).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteApplicationEmoji: (applicationId, emojiId) =>
      HttpClientRequest.del(
        `/applications/${applicationId}/emojis/${emojiId}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    updateApplicationEmoji: (applicationId, emojiId, options) =>
      HttpClientRequest.patch(
        `/applications/${applicationId}/emojis/${emojiId}`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getEntitlements: (applicationId, options) =>
      HttpClientRequest.get(`/applications/${applicationId}/entitlements`).pipe(
        HttpClientRequest.setUrlParams({
          user_id: options?.["user_id"] as any,
          sku_ids: options?.["sku_ids"] as any,
          guild_id: options?.["guild_id"] as any,
          before: options?.["before"] as any,
          after: options?.["after"] as any,
          limit: options?.["limit"] as any,
          exclude_ended: options?.["exclude_ended"] as any,
          exclude_deleted: options?.["exclude_deleted"] as any,
          only_active: options?.["only_active"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createEntitlement: (applicationId, options) =>
      HttpClientRequest.post(
        `/applications/${applicationId}/entitlements`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getEntitlement: (applicationId, entitlementId) =>
      HttpClientRequest.get(
        `/applications/${applicationId}/entitlements/${entitlementId}`,
      ).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteEntitlement: (applicationId, entitlementId) =>
      HttpClientRequest.del(
        `/applications/${applicationId}/entitlements/${entitlementId}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    consumeEntitlement: (applicationId, entitlementId) =>
      HttpClientRequest.post(
        `/applications/${applicationId}/entitlements/${entitlementId}/consume`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    listGuildApplicationCommands: (applicationId, guildId, options) =>
      HttpClientRequest.get(
        `/applications/${applicationId}/guilds/${guildId}/commands`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          with_localizations: options?.["with_localizations"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    bulkSetGuildApplicationCommands: (applicationId, guildId, options) =>
      HttpClientRequest.put(
        `/applications/${applicationId}/guilds/${guildId}/commands`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createGuildApplicationCommand: (applicationId, guildId, options) =>
      HttpClientRequest.post(
        `/applications/${applicationId}/guilds/${guildId}/commands`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["200", "201"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listGuildApplicationCommandPermissions: (applicationId, guildId) =>
      HttpClientRequest.get(
        `/applications/${applicationId}/guilds/${guildId}/commands/permissions`,
      ).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuildApplicationCommand: (applicationId, guildId, commandId) =>
      HttpClientRequest.get(
        `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
      ).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteGuildApplicationCommand: (applicationId, guildId, commandId) =>
      HttpClientRequest.del(
        `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    updateGuildApplicationCommand: (
      applicationId,
      guildId,
      commandId,
      options,
    ) =>
      HttpClientRequest.patch(
        `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuildApplicationCommandPermissions: (
      applicationId,
      guildId,
      commandId,
    ) =>
      HttpClientRequest.get(
        `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`,
      ).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    setGuildApplicationCommandPermissions: (
      applicationId,
      guildId,
      commandId,
      options,
    ) =>
      HttpClientRequest.put(
        `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getApplicationRoleConnectionsMetadata: applicationId =>
      HttpClientRequest.get(
        `/applications/${applicationId}/role-connections/metadata`,
      ).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    updateApplicationRoleConnectionsMetadata: (applicationId, options) =>
      HttpClientRequest.put(
        `/applications/${applicationId}/role-connections/metadata`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getChannel: channelId =>
      HttpClientRequest.get(`/channels/${channelId}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteChannel: channelId =>
      HttpClientRequest.del(`/channels/${channelId}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    updateChannel: (channelId, options) =>
      HttpClientRequest.patch(`/channels/${channelId}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    followChannel: (channelId, options) =>
      HttpClientRequest.post(`/channels/${channelId}/followers`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listChannelInvites: channelId =>
      HttpClientRequest.get(`/channels/${channelId}/invites`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createChannelInvite: (channelId, options) =>
      HttpClientRequest.post(`/channels/${channelId}/invites`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listMessages: (channelId, options) =>
      HttpClientRequest.get(`/channels/${channelId}/messages`).pipe(
        HttpClientRequest.setUrlParams({
          around: options?.["around"] as any,
          before: options?.["before"] as any,
          after: options?.["after"] as any,
          limit: options?.["limit"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createMessage: (channelId, options) =>
      HttpClientRequest.post(`/channels/${channelId}/messages`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    bulkDeleteMessages: (channelId, options) =>
      HttpClientRequest.post(
        `/channels/${channelId}/messages/bulk-delete`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    listPins: (channelId, options) =>
      HttpClientRequest.get(`/channels/${channelId}/messages/pins`).pipe(
        HttpClientRequest.setUrlParams({
          before: options?.["before"] as any,
          limit: options?.["limit"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createPin: (channelId, messageId) =>
      HttpClientRequest.put(
        `/channels/${channelId}/messages/pins/${messageId}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    deletePin: (channelId, messageId) =>
      HttpClientRequest.del(
        `/channels/${channelId}/messages/pins/${messageId}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    getMessage: (channelId, messageId) =>
      HttpClientRequest.get(
        `/channels/${channelId}/messages/${messageId}`,
      ).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteMessage: (channelId, messageId) =>
      HttpClientRequest.del(
        `/channels/${channelId}/messages/${messageId}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    updateMessage: (channelId, messageId, options) =>
      HttpClientRequest.patch(
        `/channels/${channelId}/messages/${messageId}`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    crosspostMessage: (channelId, messageId) =>
      HttpClientRequest.post(
        `/channels/${channelId}/messages/${messageId}/crosspost`,
      ).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteAllMessageReactions: (channelId, messageId) =>
      HttpClientRequest.del(
        `/channels/${channelId}/messages/${messageId}/reactions`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    listMessageReactionsByEmoji: (channelId, messageId, emojiName, options) =>
      HttpClientRequest.get(
        `/channels/${channelId}/messages/${messageId}/reactions/${emojiName}`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          after: options?.["after"] as any,
          limit: options?.["limit"] as any,
          type: options?.["type"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteAllMessageReactionsByEmoji: (channelId, messageId, emojiName) =>
      HttpClientRequest.del(
        `/channels/${channelId}/messages/${messageId}/reactions/${emojiName}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    addMyMessageReaction: (channelId, messageId, emojiName) =>
      HttpClientRequest.put(
        `/channels/${channelId}/messages/${messageId}/reactions/${emojiName}/@me`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    deleteMyMessageReaction: (channelId, messageId, emojiName) =>
      HttpClientRequest.del(
        `/channels/${channelId}/messages/${messageId}/reactions/${emojiName}/@me`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    deleteUserMessageReaction: (channelId, messageId, emojiName, userId) =>
      HttpClientRequest.del(
        `/channels/${channelId}/messages/${messageId}/reactions/${emojiName}/${userId}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    createThreadFromMessage: (channelId, messageId, options) =>
      HttpClientRequest.post(
        `/channels/${channelId}/messages/${messageId}/threads`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    setChannelPermissionOverwrite: (channelId, overwriteId, options) =>
      HttpClientRequest.put(
        `/channels/${channelId}/permissions/${overwriteId}`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    deleteChannelPermissionOverwrite: (channelId, overwriteId) =>
      HttpClientRequest.del(
        `/channels/${channelId}/permissions/${overwriteId}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    deprecatedListPins: channelId =>
      HttpClientRequest.get(`/channels/${channelId}/pins`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deprecatedCreatePin: (channelId, messageId) =>
      HttpClientRequest.put(`/channels/${channelId}/pins/${messageId}`).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    deprecatedDeletePin: (channelId, messageId) =>
      HttpClientRequest.del(`/channels/${channelId}/pins/${messageId}`).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    getAnswerVoters: (channelId, messageId, answerId, options) =>
      HttpClientRequest.get(
        `/channels/${channelId}/polls/${messageId}/answers/${answerId}`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          after: options?.["after"] as any,
          limit: options?.["limit"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    pollExpire: (channelId, messageId) =>
      HttpClientRequest.post(
        `/channels/${channelId}/polls/${messageId}/expire`,
      ).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    addGroupDmUser: (channelId, userId, options) =>
      HttpClientRequest.put(`/channels/${channelId}/recipients/${userId}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteGroupDmUser: (channelId, userId) =>
      HttpClientRequest.del(`/channels/${channelId}/recipients/${userId}`).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    sendSoundboardSound: (channelId, options) =>
      HttpClientRequest.post(
        `/channels/${channelId}/send-soundboard-sound`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    listThreadMembers: (channelId, options) =>
      HttpClientRequest.get(`/channels/${channelId}/thread-members`).pipe(
        HttpClientRequest.setUrlParams({
          with_member: options?.["with_member"] as any,
          limit: options?.["limit"] as any,
          after: options?.["after"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    joinThread: channelId =>
      HttpClientRequest.put(`/channels/${channelId}/thread-members/@me`).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    leaveThread: channelId =>
      HttpClientRequest.del(`/channels/${channelId}/thread-members/@me`).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    getThreadMember: (channelId, userId, options) =>
      HttpClientRequest.get(
        `/channels/${channelId}/thread-members/${userId}`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          with_member: options?.["with_member"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    addThreadMember: (channelId, userId) =>
      HttpClientRequest.put(
        `/channels/${channelId}/thread-members/${userId}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    deleteThreadMember: (channelId, userId) =>
      HttpClientRequest.del(
        `/channels/${channelId}/thread-members/${userId}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    createThread: (channelId, options) =>
      HttpClientRequest.post(`/channels/${channelId}/threads`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listPrivateArchivedThreads: (channelId, options) =>
      HttpClientRequest.get(
        `/channels/${channelId}/threads/archived/private`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          before: options?.["before"] as any,
          limit: options?.["limit"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listPublicArchivedThreads: (channelId, options) =>
      HttpClientRequest.get(
        `/channels/${channelId}/threads/archived/public`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          before: options?.["before"] as any,
          limit: options?.["limit"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    threadSearch: (channelId, options) =>
      HttpClientRequest.get(`/channels/${channelId}/threads/search`).pipe(
        HttpClientRequest.setUrlParams({
          name: options?.["name"] as any,
          slop: options?.["slop"] as any,
          min_id: options?.["min_id"] as any,
          max_id: options?.["max_id"] as any,
          tag: options?.["tag"] as any,
          tag_setting: options?.["tag_setting"] as any,
          archived: options?.["archived"] as any,
          sort_by: options?.["sort_by"] as any,
          sort_order: options?.["sort_order"] as any,
          limit: options?.["limit"] as any,
          offset: options?.["offset"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    triggerTypingIndicator: channelId =>
      HttpClientRequest.post(`/channels/${channelId}/typing`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listMyPrivateArchivedThreads: (channelId, options) =>
      HttpClientRequest.get(
        `/channels/${channelId}/users/@me/threads/archived/private`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          before: options?.["before"] as any,
          limit: options?.["limit"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listChannelWebhooks: channelId =>
      HttpClientRequest.get(`/channels/${channelId}/webhooks`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createWebhook: (channelId, options) =>
      HttpClientRequest.post(`/channels/${channelId}/webhooks`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGateway: () =>
      HttpClientRequest.get(`/gateway`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getBotGateway: () =>
      HttpClientRequest.get(`/gateway/bot`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuildTemplate: code =>
      HttpClientRequest.get(`/guilds/templates/${code}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuild: (guildId, options) =>
      HttpClientRequest.get(`/guilds/${guildId}`).pipe(
        HttpClientRequest.setUrlParams({
          with_counts: options?.["with_counts"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    updateGuild: (guildId, options) =>
      HttpClientRequest.patch(`/guilds/${guildId}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listGuildAuditLogEntries: (guildId, options) =>
      HttpClientRequest.get(`/guilds/${guildId}/audit-logs`).pipe(
        HttpClientRequest.setUrlParams({
          user_id: options?.["user_id"] as any,
          target_id: options?.["target_id"] as any,
          action_type: options?.["action_type"] as any,
          before: options?.["before"] as any,
          after: options?.["after"] as any,
          limit: options?.["limit"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listAutoModerationRules: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/auto-moderation/rules`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createAutoModerationRule: (guildId, options) =>
      HttpClientRequest.post(`/guilds/${guildId}/auto-moderation/rules`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getAutoModerationRule: (guildId, ruleId) =>
      HttpClientRequest.get(
        `/guilds/${guildId}/auto-moderation/rules/${ruleId}`,
      ).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteAutoModerationRule: (guildId, ruleId) =>
      HttpClientRequest.del(
        `/guilds/${guildId}/auto-moderation/rules/${ruleId}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    updateAutoModerationRule: (guildId, ruleId, options) =>
      HttpClientRequest.patch(
        `/guilds/${guildId}/auto-moderation/rules/${ruleId}`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listGuildBans: (guildId, options) =>
      HttpClientRequest.get(`/guilds/${guildId}/bans`).pipe(
        HttpClientRequest.setUrlParams({
          limit: options?.["limit"] as any,
          before: options?.["before"] as any,
          after: options?.["after"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuildBan: (guildId, userId) =>
      HttpClientRequest.get(`/guilds/${guildId}/bans/${userId}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    banUserFromGuild: (guildId, userId, options) =>
      HttpClientRequest.put(`/guilds/${guildId}/bans/${userId}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    unbanUserFromGuild: (guildId, userId, options) =>
      HttpClientRequest.del(`/guilds/${guildId}/bans/${userId}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    bulkBanUsersFromGuild: (guildId, options) =>
      HttpClientRequest.post(`/guilds/${guildId}/bulk-ban`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listGuildChannels: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/channels`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createGuildChannel: (guildId, options) =>
      HttpClientRequest.post(`/guilds/${guildId}/channels`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    bulkUpdateGuildChannels: (guildId, options) =>
      HttpClientRequest.patch(`/guilds/${guildId}/channels`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    listGuildEmojis: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/emojis`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createGuildEmoji: (guildId, options) =>
      HttpClientRequest.post(`/guilds/${guildId}/emojis`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuildEmoji: (guildId, emojiId) =>
      HttpClientRequest.get(`/guilds/${guildId}/emojis/${emojiId}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteGuildEmoji: (guildId, emojiId) =>
      HttpClientRequest.del(`/guilds/${guildId}/emojis/${emojiId}`).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    updateGuildEmoji: (guildId, emojiId, options) =>
      HttpClientRequest.patch(`/guilds/${guildId}/emojis/${emojiId}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listGuildIntegrations: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/integrations`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteGuildIntegration: (guildId, integrationId) =>
      HttpClientRequest.del(
        `/guilds/${guildId}/integrations/${integrationId}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    listGuildInvites: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/invites`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listGuildMembers: (guildId, options) =>
      HttpClientRequest.get(`/guilds/${guildId}/members`).pipe(
        HttpClientRequest.setUrlParams({
          limit: options?.["limit"] as any,
          after: options?.["after"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    updateMyGuildMember: (guildId, options) =>
      HttpClientRequest.patch(`/guilds/${guildId}/members/@me`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    searchGuildMembers: (guildId, options) =>
      HttpClientRequest.get(`/guilds/${guildId}/members/search`).pipe(
        HttpClientRequest.setUrlParams({
          limit: options?.["limit"] as any,
          query: options?.["query"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuildMember: (guildId, userId) =>
      HttpClientRequest.get(`/guilds/${guildId}/members/${userId}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    addGuildMember: (guildId, userId, options) =>
      HttpClientRequest.put(`/guilds/${guildId}/members/${userId}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteGuildMember: (guildId, userId) =>
      HttpClientRequest.del(`/guilds/${guildId}/members/${userId}`).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    updateGuildMember: (guildId, userId, options) =>
      HttpClientRequest.patch(`/guilds/${guildId}/members/${userId}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    addGuildMemberRole: (guildId, userId, roleId) =>
      HttpClientRequest.put(
        `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    deleteGuildMemberRole: (guildId, userId, roleId) =>
      HttpClientRequest.del(
        `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    getGuildNewMemberWelcome: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/new-member-welcome`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuildsOnboarding: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/onboarding`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    putGuildsOnboarding: (guildId, options) =>
      HttpClientRequest.put(`/guilds/${guildId}/onboarding`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuildPreview: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/preview`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    previewPruneGuild: (guildId, options) =>
      HttpClientRequest.get(`/guilds/${guildId}/prune`).pipe(
        HttpClientRequest.setUrlParams({
          days: options?.["days"] as any,
          include_roles: options?.["include_roles"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    pruneGuild: (guildId, options) =>
      HttpClientRequest.post(`/guilds/${guildId}/prune`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listGuildVoiceRegions: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/regions`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listGuildRoles: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/roles`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createGuildRole: (guildId, options) =>
      HttpClientRequest.post(`/guilds/${guildId}/roles`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    bulkUpdateGuildRoles: (guildId, options) =>
      HttpClientRequest.patch(`/guilds/${guildId}/roles`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuildRole: (guildId, roleId) =>
      HttpClientRequest.get(`/guilds/${guildId}/roles/${roleId}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteGuildRole: (guildId, roleId) =>
      HttpClientRequest.del(`/guilds/${guildId}/roles/${roleId}`).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    updateGuildRole: (guildId, roleId, options) =>
      HttpClientRequest.patch(`/guilds/${guildId}/roles/${roleId}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listGuildScheduledEvents: (guildId, options) =>
      HttpClientRequest.get(`/guilds/${guildId}/scheduled-events`).pipe(
        HttpClientRequest.setUrlParams({
          with_user_count: options?.["with_user_count"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createGuildScheduledEvent: (guildId, options) =>
      HttpClientRequest.post(`/guilds/${guildId}/scheduled-events`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuildScheduledEvent: (guildId, guildScheduledEventId, options) =>
      HttpClientRequest.get(
        `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          with_user_count: options?.["with_user_count"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteGuildScheduledEvent: (guildId, guildScheduledEventId) =>
      HttpClientRequest.del(
        `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    updateGuildScheduledEvent: (guildId, guildScheduledEventId, options) =>
      HttpClientRequest.patch(
        `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listGuildScheduledEventUsers: (guildId, guildScheduledEventId, options) =>
      HttpClientRequest.get(
        `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}/users`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          with_member: options?.["with_member"] as any,
          limit: options?.["limit"] as any,
          before: options?.["before"] as any,
          after: options?.["after"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listGuildSoundboardSounds: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/soundboard-sounds`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createGuildSoundboardSound: (guildId, options) =>
      HttpClientRequest.post(`/guilds/${guildId}/soundboard-sounds`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuildSoundboardSound: (guildId, soundId) =>
      HttpClientRequest.get(
        `/guilds/${guildId}/soundboard-sounds/${soundId}`,
      ).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteGuildSoundboardSound: (guildId, soundId) =>
      HttpClientRequest.del(
        `/guilds/${guildId}/soundboard-sounds/${soundId}`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    updateGuildSoundboardSound: (guildId, soundId, options) =>
      HttpClientRequest.patch(
        `/guilds/${guildId}/soundboard-sounds/${soundId}`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listGuildStickers: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/stickers`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createGuildSticker: (guildId, options) =>
      HttpClientRequest.post(`/guilds/${guildId}/stickers`).pipe(
        HttpClientRequest.bodyFormDataRecord(options as any),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuildSticker: (guildId, stickerId) =>
      HttpClientRequest.get(`/guilds/${guildId}/stickers/${stickerId}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteGuildSticker: (guildId, stickerId) =>
      HttpClientRequest.del(`/guilds/${guildId}/stickers/${stickerId}`).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    updateGuildSticker: (guildId, stickerId, options) =>
      HttpClientRequest.patch(`/guilds/${guildId}/stickers/${stickerId}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listGuildTemplates: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/templates`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createGuildTemplate: (guildId, options) =>
      HttpClientRequest.post(`/guilds/${guildId}/templates`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    syncGuildTemplate: (guildId, code) =>
      HttpClientRequest.put(`/guilds/${guildId}/templates/${code}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteGuildTemplate: (guildId, code) =>
      HttpClientRequest.del(`/guilds/${guildId}/templates/${code}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    updateGuildTemplate: (guildId, code, options) =>
      HttpClientRequest.patch(`/guilds/${guildId}/templates/${code}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getActiveGuildThreads: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/threads/active`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuildVanityUrl: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/vanity-url`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getSelfVoiceState: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/voice-states/@me`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    updateSelfVoiceState: (guildId, options) =>
      HttpClientRequest.patch(`/guilds/${guildId}/voice-states/@me`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    getVoiceState: (guildId, userId) =>
      HttpClientRequest.get(`/guilds/${guildId}/voice-states/${userId}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    updateVoiceState: (guildId, userId, options) =>
      HttpClientRequest.patch(`/guilds/${guildId}/voice-states/${userId}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    getGuildWebhooks: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/webhooks`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuildWelcomeScreen: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/welcome-screen`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    updateGuildWelcomeScreen: (guildId, options) =>
      HttpClientRequest.patch(`/guilds/${guildId}/welcome-screen`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuildWidgetSettings: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/widget`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    updateGuildWidgetSettings: (guildId, options) =>
      HttpClientRequest.patch(`/guilds/${guildId}/widget`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuildWidget: guildId =>
      HttpClientRequest.get(`/guilds/${guildId}/widget.json`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getGuildWidgetPng: (guildId, options) =>
      HttpClientRequest.get(`/guilds/${guildId}/widget.png`).pipe(
        HttpClientRequest.setUrlParams({ style: options?.["style"] as any }),
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    createInteractionResponse: (interactionId, interactionToken, options) =>
      HttpClientRequest.post(
        `/interactions/${interactionId}/${interactionToken}/callback`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          with_response: options.params?.["with_response"] as any,
        }),
        HttpClientRequest.bodyUnsafeJson(options.payload),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    inviteResolve: (code, options) =>
      HttpClientRequest.get(`/invites/${code}`).pipe(
        HttpClientRequest.setUrlParams({
          with_counts: options?.["with_counts"] as any,
          guild_scheduled_event_id: options?.[
            "guild_scheduled_event_id"
          ] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    inviteRevoke: code =>
      HttpClientRequest.del(`/invites/${code}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createOrJoinLobby: options =>
      HttpClientRequest.put(`/lobbies`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createLobby: options =>
      HttpClientRequest.post(`/lobbies`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getLobby: lobbyId =>
      HttpClientRequest.get(`/lobbies/${lobbyId}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    editLobby: (lobbyId, options) =>
      HttpClientRequest.patch(`/lobbies/${lobbyId}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    editLobbyChannelLink: (lobbyId, options) =>
      HttpClientRequest.patch(`/lobbies/${lobbyId}/channel-linking`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    leaveLobby: lobbyId =>
      HttpClientRequest.del(`/lobbies/${lobbyId}/members/@me`).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    createLinkedLobbyGuildInviteForSelf: lobbyId =>
      HttpClientRequest.post(`/lobbies/${lobbyId}/members/@me/invites`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    bulkUpdateLobbyMembers: (lobbyId, options) =>
      HttpClientRequest.post(`/lobbies/${lobbyId}/members/bulk`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    addLobbyMember: (lobbyId, userId, options) =>
      HttpClientRequest.put(`/lobbies/${lobbyId}/members/${userId}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteLobbyMember: (lobbyId, userId) =>
      HttpClientRequest.del(`/lobbies/${lobbyId}/members/${userId}`).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    createLinkedLobbyGuildInviteForUser: (lobbyId, userId) =>
      HttpClientRequest.post(
        `/lobbies/${lobbyId}/members/${userId}/invites`,
      ).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getLobbyMessages: (lobbyId, options) =>
      HttpClientRequest.get(`/lobbies/${lobbyId}/messages`).pipe(
        HttpClientRequest.setUrlParams({ limit: options?.["limit"] as any }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createLobbyMessage: (lobbyId, options) =>
      HttpClientRequest.post(`/lobbies/${lobbyId}/messages`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getMyOauth2Authorization: () =>
      HttpClientRequest.get(`/oauth2/@me`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getMyOauth2Application: () =>
      HttpClientRequest.get(`/oauth2/applications/@me`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getPublicKeys: () =>
      HttpClientRequest.get(`/oauth2/keys`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getOpenidConnectUserinfo: () =>
      HttpClientRequest.get(`/oauth2/userinfo`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    partnerSdkUnmergeProvisionalAccount: options =>
      HttpClientRequest.post(`/partner-sdk/provisional-accounts/unmerge`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    botPartnerSdkUnmergeProvisionalAccount: options =>
      HttpClientRequest.post(
        `/partner-sdk/provisional-accounts/unmerge/bot`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    partnerSdkToken: options =>
      HttpClientRequest.post(`/partner-sdk/token`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    botPartnerSdkToken: options =>
      HttpClientRequest.post(`/partner-sdk/token/bot`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getSoundboardDefaultSounds: () =>
      HttpClientRequest.get(`/soundboard-default-sounds`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    createStageInstance: options =>
      HttpClientRequest.post(`/stage-instances`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getStageInstance: channelId =>
      HttpClientRequest.get(`/stage-instances/${channelId}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteStageInstance: channelId =>
      HttpClientRequest.del(`/stage-instances/${channelId}`).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    updateStageInstance: (channelId, options) =>
      HttpClientRequest.patch(`/stage-instances/${channelId}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listStickerPacks: () =>
      HttpClientRequest.get(`/sticker-packs`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getStickerPack: packId =>
      HttpClientRequest.get(`/sticker-packs/${packId}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getSticker: stickerId =>
      HttpClientRequest.get(`/stickers/${stickerId}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getMyUser: () =>
      HttpClientRequest.get(`/users/@me`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    updateMyUser: options =>
      HttpClientRequest.patch(`/users/@me`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getApplicationUserRoleConnection: applicationId =>
      HttpClientRequest.get(
        `/users/@me/applications/${applicationId}/role-connection`,
      ).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    updateApplicationUserRoleConnection: (applicationId, options) =>
      HttpClientRequest.put(
        `/users/@me/applications/${applicationId}/role-connection`,
      ).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteApplicationUserRoleConnection: applicationId =>
      HttpClientRequest.del(
        `/users/@me/applications/${applicationId}/role-connection`,
      ).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    createDm: options =>
      HttpClientRequest.post(`/users/@me/channels`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listMyConnections: () =>
      HttpClientRequest.get(`/users/@me/connections`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listMyGuilds: options =>
      HttpClientRequest.get(`/users/@me/guilds`).pipe(
        HttpClientRequest.setUrlParams({
          before: options?.["before"] as any,
          after: options?.["after"] as any,
          limit: options?.["limit"] as any,
          with_counts: options?.["with_counts"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    leaveGuild: guildId =>
      HttpClientRequest.del(`/users/@me/guilds/${guildId}`).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    getMyGuildMember: guildId =>
      HttpClientRequest.get(`/users/@me/guilds/${guildId}/member`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getUser: userId =>
      HttpClientRequest.get(`/users/${userId}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    listVoiceRegions: () =>
      HttpClientRequest.get(`/voice/regions`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getWebhook: webhookId =>
      HttpClientRequest.get(`/webhooks/${webhookId}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteWebhook: webhookId =>
      HttpClientRequest.del(`/webhooks/${webhookId}`).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    updateWebhook: (webhookId, options) =>
      HttpClientRequest.patch(`/webhooks/${webhookId}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getWebhookByToken: (webhookId, webhookToken) =>
      HttpClientRequest.get(`/webhooks/${webhookId}/${webhookToken}`).pipe(
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    executeWebhook: (webhookId, webhookToken, options) =>
      HttpClientRequest.post(`/webhooks/${webhookId}/${webhookToken}`).pipe(
        HttpClientRequest.setUrlParams({
          wait: options.params?.["wait"] as any,
          thread_id: options.params?.["thread_id"] as any,
          with_components: options.params?.["with_components"] as any,
        }),
        HttpClientRequest.bodyUnsafeJson(options.payload),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteWebhookByToken: (webhookId, webhookToken) =>
      HttpClientRequest.del(`/webhooks/${webhookId}/${webhookToken}`).pipe(
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    updateWebhookByToken: (webhookId, webhookToken, options) =>
      HttpClientRequest.patch(`/webhooks/${webhookId}/${webhookToken}`).pipe(
        HttpClientRequest.bodyUnsafeJson(options),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    executeGithubCompatibleWebhook: (webhookId, webhookToken, options) =>
      HttpClientRequest.post(
        `/webhooks/${webhookId}/${webhookToken}/github`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          wait: options.params?.["wait"] as any,
          thread_id: options.params?.["thread_id"] as any,
        }),
        HttpClientRequest.bodyUnsafeJson(options.payload),
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    getOriginalWebhookMessage: (webhookId, webhookToken, options) =>
      HttpClientRequest.get(
        `/webhooks/${webhookId}/${webhookToken}/messages/@original`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          thread_id: options?.["thread_id"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteOriginalWebhookMessage: (webhookId, webhookToken, options) =>
      HttpClientRequest.del(
        `/webhooks/${webhookId}/${webhookToken}/messages/@original`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          thread_id: options?.["thread_id"] as any,
        }),
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    updateOriginalWebhookMessage: (webhookId, webhookToken, options) =>
      HttpClientRequest.patch(
        `/webhooks/${webhookId}/${webhookToken}/messages/@original`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          thread_id: options.params?.["thread_id"] as any,
          with_components: options.params?.["with_components"] as any,
        }),
        HttpClientRequest.bodyUnsafeJson(options.payload),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    getWebhookMessage: (webhookId, webhookToken, messageId, options) =>
      HttpClientRequest.get(
        `/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          thread_id: options?.["thread_id"] as any,
        }),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    deleteWebhookMessage: (webhookId, webhookToken, messageId, options) =>
      HttpClientRequest.del(
        `/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          thread_id: options?.["thread_id"] as any,
        }),
        onRequest([], { "429": "RatelimitedResponse", "4xx": "ErrorResponse" }),
      ),
    updateWebhookMessage: (webhookId, webhookToken, messageId, options) =>
      HttpClientRequest.patch(
        `/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          thread_id: options.params?.["thread_id"] as any,
          with_components: options.params?.["with_components"] as any,
        }),
        HttpClientRequest.bodyUnsafeJson(options.payload),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
    executeSlackCompatibleWebhook: (webhookId, webhookToken, options) =>
      HttpClientRequest.post(
        `/webhooks/${webhookId}/${webhookToken}/slack`,
      ).pipe(
        HttpClientRequest.setUrlParams({
          wait: options.params?.["wait"] as any,
          thread_id: options.params?.["thread_id"] as any,
        }),
        HttpClientRequest.bodyUnsafeJson(options.payload),
        onRequest(["2xx"], {
          "429": "RatelimitedResponse",
          "4xx": "ErrorResponse",
        }),
      ),
  }
}

export interface DiscordRest {
  readonly httpClient: HttpClient.HttpClient
  readonly getMyApplication: () => Effect.Effect<
    PrivateApplicationResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateMyApplication: (
    options: ApplicationFormPartial,
  ) => Effect.Effect<
    PrivateApplicationResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getApplication: (
    applicationId: string,
  ) => Effect.Effect<
    PrivateApplicationResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateApplication: (
    applicationId: string,
    options: ApplicationFormPartial,
  ) => Effect.Effect<
    PrivateApplicationResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly applicationsGetActivityInstance: (
    applicationId: string,
    instanceId: string,
  ) => Effect.Effect<
    EmbeddedActivityInstance,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly uploadApplicationAttachment: (
    applicationId: string,
    options: UploadApplicationAttachmentRequest,
  ) => Effect.Effect<
    ActivitiesAttachmentResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listApplicationCommands: (
    applicationId: string,
    options?: ListApplicationCommandsParams | undefined,
  ) => Effect.Effect<
    ListApplicationCommands200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly bulkSetApplicationCommands: (
    applicationId: string,
    options: BulkSetApplicationCommandsRequest,
  ) => Effect.Effect<
    BulkSetApplicationCommands200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createApplicationCommand: (
    applicationId: string,
    options: ApplicationCommandCreateRequest,
  ) => Effect.Effect<
    ApplicationCommandResponse | ApplicationCommandResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getApplicationCommand: (
    applicationId: string,
    commandId: string,
  ) => Effect.Effect<
    ApplicationCommandResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteApplicationCommand: (
    applicationId: string,
    commandId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateApplicationCommand: (
    applicationId: string,
    commandId: string,
    options: ApplicationCommandPatchRequestPartial,
  ) => Effect.Effect<
    ApplicationCommandResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listApplicationEmojis: (
    applicationId: string,
  ) => Effect.Effect<
    ListApplicationEmojisResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createApplicationEmoji: (
    applicationId: string,
    options: CreateApplicationEmojiRequest,
  ) => Effect.Effect<
    EmojiResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getApplicationEmoji: (
    applicationId: string,
    emojiId: string,
  ) => Effect.Effect<
    EmojiResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteApplicationEmoji: (
    applicationId: string,
    emojiId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateApplicationEmoji: (
    applicationId: string,
    emojiId: string,
    options: UpdateApplicationEmojiRequest,
  ) => Effect.Effect<
    EmojiResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getEntitlements: (
    applicationId: string,
    options?: GetEntitlementsParams | undefined,
  ) => Effect.Effect<
    GetEntitlements200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createEntitlement: (
    applicationId: string,
    options: CreateEntitlementRequestData,
  ) => Effect.Effect<
    EntitlementResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getEntitlement: (
    applicationId: string,
    entitlementId: string,
  ) => Effect.Effect<
    EntitlementResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteEntitlement: (
    applicationId: string,
    entitlementId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly consumeEntitlement: (
    applicationId: string,
    entitlementId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listGuildApplicationCommands: (
    applicationId: string,
    guildId: string,
    options?: ListGuildApplicationCommandsParams | undefined,
  ) => Effect.Effect<
    ListGuildApplicationCommands200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly bulkSetGuildApplicationCommands: (
    applicationId: string,
    guildId: string,
    options: BulkSetGuildApplicationCommandsRequest,
  ) => Effect.Effect<
    BulkSetGuildApplicationCommands200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createGuildApplicationCommand: (
    applicationId: string,
    guildId: string,
    options: ApplicationCommandCreateRequest,
  ) => Effect.Effect<
    ApplicationCommandResponse | ApplicationCommandResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listGuildApplicationCommandPermissions: (
    applicationId: string,
    guildId: string,
  ) => Effect.Effect<
    ListGuildApplicationCommandPermissions200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildApplicationCommand: (
    applicationId: string,
    guildId: string,
    commandId: string,
  ) => Effect.Effect<
    ApplicationCommandResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteGuildApplicationCommand: (
    applicationId: string,
    guildId: string,
    commandId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateGuildApplicationCommand: (
    applicationId: string,
    guildId: string,
    commandId: string,
    options: ApplicationCommandPatchRequestPartial,
  ) => Effect.Effect<
    ApplicationCommandResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildApplicationCommandPermissions: (
    applicationId: string,
    guildId: string,
    commandId: string,
  ) => Effect.Effect<
    CommandPermissionsResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly setGuildApplicationCommandPermissions: (
    applicationId: string,
    guildId: string,
    commandId: string,
    options: SetGuildApplicationCommandPermissionsRequest,
  ) => Effect.Effect<
    CommandPermissionsResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getApplicationRoleConnectionsMetadata: (
    applicationId: string,
  ) => Effect.Effect<
    GetApplicationRoleConnectionsMetadata200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateApplicationRoleConnectionsMetadata: (
    applicationId: string,
    options: UpdateApplicationRoleConnectionsMetadataRequest,
  ) => Effect.Effect<
    UpdateApplicationRoleConnectionsMetadata200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getChannel: (
    channelId: string,
  ) => Effect.Effect<
    GetChannel200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteChannel: (
    channelId: string,
  ) => Effect.Effect<
    DeleteChannel200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateChannel: (
    channelId: string,
    options: UpdateChannelRequest,
  ) => Effect.Effect<
    UpdateChannel200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly followChannel: (
    channelId: string,
    options: FollowChannelRequest,
  ) => Effect.Effect<
    ChannelFollowerResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listChannelInvites: (
    channelId: string,
  ) => Effect.Effect<
    ListChannelInvites200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createChannelInvite: (
    channelId: string,
    options: CreateChannelInviteRequest,
  ) => Effect.Effect<
    CreateChannelInvite200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listMessages: (
    channelId: string,
    options?: ListMessagesParams | undefined,
  ) => Effect.Effect<
    ListMessages200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createMessage: (
    channelId: string,
    options: MessageCreateRequest,
  ) => Effect.Effect<
    MessageResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly bulkDeleteMessages: (
    channelId: string,
    options: BulkDeleteMessagesRequest,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listPins: (
    channelId: string,
    options?: ListPinsParams | undefined,
  ) => Effect.Effect<
    PinnedMessagesResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createPin: (
    channelId: string,
    messageId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deletePin: (
    channelId: string,
    messageId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getMessage: (
    channelId: string,
    messageId: string,
  ) => Effect.Effect<
    MessageResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteMessage: (
    channelId: string,
    messageId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateMessage: (
    channelId: string,
    messageId: string,
    options: MessageEditRequestPartial,
  ) => Effect.Effect<
    MessageResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly crosspostMessage: (
    channelId: string,
    messageId: string,
  ) => Effect.Effect<
    MessageResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteAllMessageReactions: (
    channelId: string,
    messageId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listMessageReactionsByEmoji: (
    channelId: string,
    messageId: string,
    emojiName: string,
    options?: ListMessageReactionsByEmojiParams | undefined,
  ) => Effect.Effect<
    ListMessageReactionsByEmoji200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteAllMessageReactionsByEmoji: (
    channelId: string,
    messageId: string,
    emojiName: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly addMyMessageReaction: (
    channelId: string,
    messageId: string,
    emojiName: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteMyMessageReaction: (
    channelId: string,
    messageId: string,
    emojiName: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteUserMessageReaction: (
    channelId: string,
    messageId: string,
    emojiName: string,
    userId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createThreadFromMessage: (
    channelId: string,
    messageId: string,
    options: CreateTextThreadWithMessageRequest,
  ) => Effect.Effect<
    ThreadResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly setChannelPermissionOverwrite: (
    channelId: string,
    overwriteId: string,
    options: SetChannelPermissionOverwriteRequest,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteChannelPermissionOverwrite: (
    channelId: string,
    overwriteId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deprecatedListPins: (
    channelId: string,
  ) => Effect.Effect<
    DeprecatedListPins200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deprecatedCreatePin: (
    channelId: string,
    messageId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deprecatedDeletePin: (
    channelId: string,
    messageId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getAnswerVoters: (
    channelId: string,
    messageId: string,
    answerId: string,
    options?: GetAnswerVotersParams | undefined,
  ) => Effect.Effect<
    PollAnswerDetailsResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly pollExpire: (
    channelId: string,
    messageId: string,
  ) => Effect.Effect<
    MessageResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly addGroupDmUser: (
    channelId: string,
    userId: string,
    options: AddGroupDmUserRequest,
  ) => Effect.Effect<
    AddGroupDmUser201,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteGroupDmUser: (
    channelId: string,
    userId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly sendSoundboardSound: (
    channelId: string,
    options: SoundboardSoundSendRequest,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listThreadMembers: (
    channelId: string,
    options?: ListThreadMembersParams | undefined,
  ) => Effect.Effect<
    ListThreadMembers200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly joinThread: (
    channelId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly leaveThread: (
    channelId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getThreadMember: (
    channelId: string,
    userId: string,
    options?: GetThreadMemberParams | undefined,
  ) => Effect.Effect<
    ThreadMemberResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly addThreadMember: (
    channelId: string,
    userId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteThreadMember: (
    channelId: string,
    userId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createThread: (
    channelId: string,
    options: CreateThreadRequest,
  ) => Effect.Effect<
    CreatedThreadResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listPrivateArchivedThreads: (
    channelId: string,
    options?: ListPrivateArchivedThreadsParams | undefined,
  ) => Effect.Effect<
    ThreadsResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listPublicArchivedThreads: (
    channelId: string,
    options?: ListPublicArchivedThreadsParams | undefined,
  ) => Effect.Effect<
    ThreadsResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly threadSearch: (
    channelId: string,
    options?: ThreadSearchParams | undefined,
  ) => Effect.Effect<
    ThreadSearchResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly triggerTypingIndicator: (
    channelId: string,
  ) => Effect.Effect<
    TypingIndicatorResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listMyPrivateArchivedThreads: (
    channelId: string,
    options?: ListMyPrivateArchivedThreadsParams | undefined,
  ) => Effect.Effect<
    ThreadsResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listChannelWebhooks: (
    channelId: string,
  ) => Effect.Effect<
    ListChannelWebhooks200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createWebhook: (
    channelId: string,
    options: CreateWebhookRequest,
  ) => Effect.Effect<
    GuildIncomingWebhookResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGateway: () => Effect.Effect<
    GatewayResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getBotGateway: () => Effect.Effect<
    GatewayBotResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildTemplate: (
    code: string,
  ) => Effect.Effect<
    GuildTemplateResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuild: (
    guildId: string,
    options?: GetGuildParams | undefined,
  ) => Effect.Effect<
    GuildWithCountsResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateGuild: (
    guildId: string,
    options: GuildPatchRequestPartial,
  ) => Effect.Effect<
    GuildResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listGuildAuditLogEntries: (
    guildId: string,
    options?: ListGuildAuditLogEntriesParams | undefined,
  ) => Effect.Effect<
    GuildAuditLogResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listAutoModerationRules: (
    guildId: string,
  ) => Effect.Effect<
    ListAutoModerationRules200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createAutoModerationRule: (
    guildId: string,
    options: CreateAutoModerationRuleRequest,
  ) => Effect.Effect<
    CreateAutoModerationRule200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getAutoModerationRule: (
    guildId: string,
    ruleId: string,
  ) => Effect.Effect<
    GetAutoModerationRule200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteAutoModerationRule: (
    guildId: string,
    ruleId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateAutoModerationRule: (
    guildId: string,
    ruleId: string,
    options: UpdateAutoModerationRuleRequest,
  ) => Effect.Effect<
    UpdateAutoModerationRule200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listGuildBans: (
    guildId: string,
    options?: ListGuildBansParams | undefined,
  ) => Effect.Effect<
    ListGuildBans200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildBan: (
    guildId: string,
    userId: string,
  ) => Effect.Effect<
    GuildBanResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly banUserFromGuild: (
    guildId: string,
    userId: string,
    options: BanUserFromGuildRequest,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly unbanUserFromGuild: (
    guildId: string,
    userId: string,
    options: UnbanUserFromGuildRequest,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly bulkBanUsersFromGuild: (
    guildId: string,
    options: BulkBanUsersRequest,
  ) => Effect.Effect<
    BulkBanUsersResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listGuildChannels: (
    guildId: string,
  ) => Effect.Effect<
    ListGuildChannels200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createGuildChannel: (
    guildId: string,
    options: CreateGuildChannelRequest,
  ) => Effect.Effect<
    GuildChannelResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly bulkUpdateGuildChannels: (
    guildId: string,
    options: BulkUpdateGuildChannelsRequest,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listGuildEmojis: (
    guildId: string,
  ) => Effect.Effect<
    ListGuildEmojis200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createGuildEmoji: (
    guildId: string,
    options: CreateGuildEmojiRequest,
  ) => Effect.Effect<
    EmojiResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildEmoji: (
    guildId: string,
    emojiId: string,
  ) => Effect.Effect<
    EmojiResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteGuildEmoji: (
    guildId: string,
    emojiId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateGuildEmoji: (
    guildId: string,
    emojiId: string,
    options: UpdateGuildEmojiRequest,
  ) => Effect.Effect<
    EmojiResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listGuildIntegrations: (
    guildId: string,
  ) => Effect.Effect<
    ListGuildIntegrations200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteGuildIntegration: (
    guildId: string,
    integrationId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listGuildInvites: (
    guildId: string,
  ) => Effect.Effect<
    ListGuildInvites200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listGuildMembers: (
    guildId: string,
    options?: ListGuildMembersParams | undefined,
  ) => Effect.Effect<
    ListGuildMembers200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateMyGuildMember: (
    guildId: string,
    options: UpdateMyGuildMemberRequest,
  ) => Effect.Effect<
    PrivateGuildMemberResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly searchGuildMembers: (
    guildId: string,
    options: SearchGuildMembersParams,
  ) => Effect.Effect<
    SearchGuildMembers200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildMember: (
    guildId: string,
    userId: string,
  ) => Effect.Effect<
    GuildMemberResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly addGuildMember: (
    guildId: string,
    userId: string,
    options: BotAddGuildMemberRequest,
  ) => Effect.Effect<
    GuildMemberResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteGuildMember: (
    guildId: string,
    userId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateGuildMember: (
    guildId: string,
    userId: string,
    options: UpdateGuildMemberRequest,
  ) => Effect.Effect<
    GuildMemberResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly addGuildMemberRole: (
    guildId: string,
    userId: string,
    roleId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteGuildMemberRole: (
    guildId: string,
    userId: string,
    roleId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildNewMemberWelcome: (
    guildId: string,
  ) => Effect.Effect<
    GuildHomeSettingsResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildsOnboarding: (
    guildId: string,
  ) => Effect.Effect<
    UserGuildOnboardingResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly putGuildsOnboarding: (
    guildId: string,
    options: UpdateGuildOnboardingRequest,
  ) => Effect.Effect<
    GuildOnboardingResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildPreview: (
    guildId: string,
  ) => Effect.Effect<
    GuildPreviewResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly previewPruneGuild: (
    guildId: string,
    options?: PreviewPruneGuildParams | undefined,
  ) => Effect.Effect<
    GuildPruneResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly pruneGuild: (
    guildId: string,
    options: PruneGuildRequest,
  ) => Effect.Effect<
    GuildPruneResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listGuildVoiceRegions: (
    guildId: string,
  ) => Effect.Effect<
    ListGuildVoiceRegions200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listGuildRoles: (
    guildId: string,
  ) => Effect.Effect<
    ListGuildRoles200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createGuildRole: (
    guildId: string,
    options: CreateRoleRequest,
  ) => Effect.Effect<
    GuildRoleResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly bulkUpdateGuildRoles: (
    guildId: string,
    options: BulkUpdateGuildRolesRequest,
  ) => Effect.Effect<
    BulkUpdateGuildRoles200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildRole: (
    guildId: string,
    roleId: string,
  ) => Effect.Effect<
    GuildRoleResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteGuildRole: (
    guildId: string,
    roleId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateGuildRole: (
    guildId: string,
    roleId: string,
    options: UpdateRoleRequestPartial,
  ) => Effect.Effect<
    GuildRoleResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listGuildScheduledEvents: (
    guildId: string,
    options?: ListGuildScheduledEventsParams | undefined,
  ) => Effect.Effect<
    ListGuildScheduledEvents200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createGuildScheduledEvent: (
    guildId: string,
    options: CreateGuildScheduledEventRequest,
  ) => Effect.Effect<
    CreateGuildScheduledEvent200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildScheduledEvent: (
    guildId: string,
    guildScheduledEventId: string,
    options?: GetGuildScheduledEventParams | undefined,
  ) => Effect.Effect<
    GetGuildScheduledEvent200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteGuildScheduledEvent: (
    guildId: string,
    guildScheduledEventId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateGuildScheduledEvent: (
    guildId: string,
    guildScheduledEventId: string,
    options: UpdateGuildScheduledEventRequest,
  ) => Effect.Effect<
    UpdateGuildScheduledEvent200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listGuildScheduledEventUsers: (
    guildId: string,
    guildScheduledEventId: string,
    options?: ListGuildScheduledEventUsersParams | undefined,
  ) => Effect.Effect<
    ListGuildScheduledEventUsers200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listGuildSoundboardSounds: (
    guildId: string,
  ) => Effect.Effect<
    ListGuildSoundboardSoundsResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createGuildSoundboardSound: (
    guildId: string,
    options: SoundboardCreateRequest,
  ) => Effect.Effect<
    SoundboardSoundResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildSoundboardSound: (
    guildId: string,
    soundId: string,
  ) => Effect.Effect<
    SoundboardSoundResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteGuildSoundboardSound: (
    guildId: string,
    soundId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateGuildSoundboardSound: (
    guildId: string,
    soundId: string,
    options: SoundboardPatchRequestPartial,
  ) => Effect.Effect<
    SoundboardSoundResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listGuildStickers: (
    guildId: string,
  ) => Effect.Effect<
    ListGuildStickers200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createGuildSticker: (
    guildId: string,
    options: CreateGuildStickerRequest,
  ) => Effect.Effect<
    GuildStickerResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildSticker: (
    guildId: string,
    stickerId: string,
  ) => Effect.Effect<
    GuildStickerResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteGuildSticker: (
    guildId: string,
    stickerId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateGuildSticker: (
    guildId: string,
    stickerId: string,
    options: UpdateGuildStickerRequest,
  ) => Effect.Effect<
    GuildStickerResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listGuildTemplates: (
    guildId: string,
  ) => Effect.Effect<
    ListGuildTemplates200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createGuildTemplate: (
    guildId: string,
    options: CreateGuildTemplateRequest,
  ) => Effect.Effect<
    GuildTemplateResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly syncGuildTemplate: (
    guildId: string,
    code: string,
  ) => Effect.Effect<
    GuildTemplateResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteGuildTemplate: (
    guildId: string,
    code: string,
  ) => Effect.Effect<
    GuildTemplateResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateGuildTemplate: (
    guildId: string,
    code: string,
    options: UpdateGuildTemplateRequest,
  ) => Effect.Effect<
    GuildTemplateResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getActiveGuildThreads: (
    guildId: string,
  ) => Effect.Effect<
    ThreadsResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildVanityUrl: (
    guildId: string,
  ) => Effect.Effect<
    VanityURLResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getSelfVoiceState: (
    guildId: string,
  ) => Effect.Effect<
    VoiceStateResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateSelfVoiceState: (
    guildId: string,
    options: UpdateSelfVoiceStateRequestPartial,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getVoiceState: (
    guildId: string,
    userId: string,
  ) => Effect.Effect<
    VoiceStateResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateVoiceState: (
    guildId: string,
    userId: string,
    options: UpdateVoiceStateRequestPartial,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildWebhooks: (
    guildId: string,
  ) => Effect.Effect<
    GetGuildWebhooks200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildWelcomeScreen: (
    guildId: string,
  ) => Effect.Effect<
    GuildWelcomeScreenResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateGuildWelcomeScreen: (
    guildId: string,
    options: WelcomeScreenPatchRequestPartial,
  ) => Effect.Effect<
    GuildWelcomeScreenResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildWidgetSettings: (
    guildId: string,
  ) => Effect.Effect<
    WidgetSettingsResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateGuildWidgetSettings: (
    guildId: string,
    options: UpdateGuildWidgetSettingsRequest,
  ) => Effect.Effect<
    WidgetSettingsResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildWidget: (
    guildId: string,
  ) => Effect.Effect<
    WidgetResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getGuildWidgetPng: (
    guildId: string,
    options?: GetGuildWidgetPngParams | undefined,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createInteractionResponse: (
    interactionId: string,
    interactionToken: string,
    options: {
      readonly params?: CreateInteractionResponseParams | undefined
      readonly payload: CreateInteractionResponseRequest
    },
  ) => Effect.Effect<
    InteractionCallbackResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly inviteResolve: (
    code: string,
    options?: InviteResolveParams | undefined,
  ) => Effect.Effect<
    InviteResolve200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly inviteRevoke: (
    code: string,
  ) => Effect.Effect<
    InviteRevoke200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createOrJoinLobby: (
    options: CreateOrJoinLobbyRequest,
  ) => Effect.Effect<
    LobbyResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createLobby: (
    options: CreateLobbyRequest,
  ) => Effect.Effect<
    LobbyResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getLobby: (
    lobbyId: string,
  ) => Effect.Effect<
    LobbyResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly editLobby: (
    lobbyId: string,
    options: EditLobbyRequest,
  ) => Effect.Effect<
    LobbyResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly editLobbyChannelLink: (
    lobbyId: string,
    options: EditLobbyChannelLinkRequest,
  ) => Effect.Effect<
    LobbyResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly leaveLobby: (
    lobbyId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createLinkedLobbyGuildInviteForSelf: (
    lobbyId: string,
  ) => Effect.Effect<
    LobbyGuildInviteResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly bulkUpdateLobbyMembers: (
    lobbyId: string,
    options: BulkUpdateLobbyMembersRequest,
  ) => Effect.Effect<
    BulkUpdateLobbyMembers200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly addLobbyMember: (
    lobbyId: string,
    userId: string,
    options: AddLobbyMemberRequest,
  ) => Effect.Effect<
    LobbyMemberResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteLobbyMember: (
    lobbyId: string,
    userId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createLinkedLobbyGuildInviteForUser: (
    lobbyId: string,
    userId: string,
  ) => Effect.Effect<
    LobbyGuildInviteResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getLobbyMessages: (
    lobbyId: string,
    options?: GetLobbyMessagesParams | undefined,
  ) => Effect.Effect<
    GetLobbyMessages200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createLobbyMessage: (
    lobbyId: string,
    options: SDKMessageRequest,
  ) => Effect.Effect<
    LobbyMessageResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getMyOauth2Authorization: () => Effect.Effect<
    OAuth2GetAuthorizationResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getMyOauth2Application: () => Effect.Effect<
    PrivateApplicationResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getPublicKeys: () => Effect.Effect<
    OAuth2GetKeys,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getOpenidConnectUserinfo: () => Effect.Effect<
    OAuth2GetOpenIDConnectUserInfoResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly partnerSdkUnmergeProvisionalAccount: (
    options: PartnerSdkUnmergeProvisionalAccountRequest,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly botPartnerSdkUnmergeProvisionalAccount: (
    options: BotPartnerSdkUnmergeProvisionalAccountRequest,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly partnerSdkToken: (
    options: PartnerSdkTokenRequest,
  ) => Effect.Effect<
    ProvisionalTokenResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly botPartnerSdkToken: (
    options: BotPartnerSdkTokenRequest,
  ) => Effect.Effect<
    ProvisionalTokenResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getSoundboardDefaultSounds: () => Effect.Effect<
    GetSoundboardDefaultSounds200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createStageInstance: (
    options: CreateStageInstanceRequest,
  ) => Effect.Effect<
    StageInstanceResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getStageInstance: (
    channelId: string,
  ) => Effect.Effect<
    StageInstanceResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteStageInstance: (
    channelId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateStageInstance: (
    channelId: string,
    options: UpdateStageInstanceRequest,
  ) => Effect.Effect<
    StageInstanceResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listStickerPacks: () => Effect.Effect<
    StickerPackCollectionResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getStickerPack: (
    packId: string,
  ) => Effect.Effect<
    StickerPackResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getSticker: (
    stickerId: string,
  ) => Effect.Effect<
    GetSticker200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getMyUser: () => Effect.Effect<
    UserPIIResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateMyUser: (
    options: BotAccountPatchRequest,
  ) => Effect.Effect<
    UserPIIResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getApplicationUserRoleConnection: (
    applicationId: string,
  ) => Effect.Effect<
    ApplicationUserRoleConnectionResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateApplicationUserRoleConnection: (
    applicationId: string,
    options: UpdateApplicationUserRoleConnectionRequest,
  ) => Effect.Effect<
    ApplicationUserRoleConnectionResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteApplicationUserRoleConnection: (
    applicationId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly createDm: (
    options: CreatePrivateChannelRequest,
  ) => Effect.Effect<
    CreateDm200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listMyConnections: () => Effect.Effect<
    ListMyConnections200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listMyGuilds: (
    options?: ListMyGuildsParams | undefined,
  ) => Effect.Effect<
    ListMyGuilds200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly leaveGuild: (
    guildId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getMyGuildMember: (
    guildId: string,
  ) => Effect.Effect<
    PrivateGuildMemberResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getUser: (
    userId: string,
  ) => Effect.Effect<
    UserResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly listVoiceRegions: () => Effect.Effect<
    ListVoiceRegions200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getWebhook: (
    webhookId: string,
  ) => Effect.Effect<
    GetWebhook200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteWebhook: (
    webhookId: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateWebhook: (
    webhookId: string,
    options: UpdateWebhookRequest,
  ) => Effect.Effect<
    UpdateWebhook200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getWebhookByToken: (
    webhookId: string,
    webhookToken: string,
  ) => Effect.Effect<
    GetWebhookByToken200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly executeWebhook: (
    webhookId: string,
    webhookToken: string,
    options: {
      readonly params?: ExecuteWebhookParams | undefined
      readonly payload: ExecuteWebhookRequest
    },
  ) => Effect.Effect<
    MessageResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteWebhookByToken: (
    webhookId: string,
    webhookToken: string,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateWebhookByToken: (
    webhookId: string,
    webhookToken: string,
    options: UpdateWebhookByTokenRequest,
  ) => Effect.Effect<
    UpdateWebhookByToken200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly executeGithubCompatibleWebhook: (
    webhookId: string,
    webhookToken: string,
    options: {
      readonly params?: ExecuteGithubCompatibleWebhookParams | undefined
      readonly payload: GithubWebhook
    },
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getOriginalWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    options?: GetOriginalWebhookMessageParams | undefined,
  ) => Effect.Effect<
    MessageResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteOriginalWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    options?: DeleteOriginalWebhookMessageParams | undefined,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateOriginalWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    options: {
      readonly params?: UpdateOriginalWebhookMessageParams | undefined
      readonly payload: IncomingWebhookUpdateRequestPartial
    },
  ) => Effect.Effect<
    MessageResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly getWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    messageId: string,
    options?: GetWebhookMessageParams | undefined,
  ) => Effect.Effect<
    MessageResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly deleteWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    messageId: string,
    options?: DeleteWebhookMessageParams | undefined,
  ) => Effect.Effect<
    void,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly updateWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    messageId: string,
    options: {
      readonly params?: UpdateWebhookMessageParams | undefined
      readonly payload: IncomingWebhookUpdateRequestPartial
    },
  ) => Effect.Effect<
    MessageResponse,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
  readonly executeSlackCompatibleWebhook: (
    webhookId: string,
    webhookToken: string,
    options: {
      readonly params?: ExecuteSlackCompatibleWebhookParams | undefined
      readonly payload: SlackWebhook
    },
  ) => Effect.Effect<
    ExecuteSlackCompatibleWebhook200,
    | HttpClientError.HttpClientError
    | DiscordRestError<"RatelimitedResponse", RatelimitedResponse>
    | DiscordRestError<"ErrorResponse", ErrorResponse>
  >
}

export interface DiscordRestError<Tag extends string, E> {
  readonly _tag: Tag
  readonly request: HttpClientRequest.HttpClientRequest
  readonly response: HttpClientResponse.HttpClientResponse
  readonly cause: E
}

class DiscordRestErrorImpl extends Data.Error<{
  _tag: string
  cause: any
  request: HttpClientRequest.HttpClientRequest
  response: HttpClientResponse.HttpClientResponse
}> {}

export const DiscordRestError = <Tag extends string, E>(
  tag: Tag,
  cause: E,
  response: HttpClientResponse.HttpClientResponse,
): DiscordRestError<Tag, E> =>
  new DiscordRestErrorImpl({
    _tag: tag,
    cause,
    response,
    request: response.request,
  }) as any
