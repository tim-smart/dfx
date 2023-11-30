import type { RestResponse } from "dfx/DiscordREST/types"

export interface ActionMetadatum {
  /** SEND_ALERT_MESSAGE */
  readonly channel_id: Snowflake
  /** TIMEOUT */
  readonly duration_seconds: number
  /** BLOCK_MESSAGE */
  readonly custom_message?: string
}
export interface ActionRow {
  /** component type */
  readonly type: ComponentType
  /** a list of child components */
  readonly components: Array<Component>
}
export enum ActionType {
  /** blocks a member's message and prevents it from being posted. A custom explanation can be specified and shown to members whenever their message is blocked. */
  BLOCK_MESSAGE = 1,
  /** logs user content to a specified channel */
  SEND_ALERT_MESSAGE = 2,
  /** timeout user for a specified duration * */
  TIMEOUT = 3,
}
export interface Activity {
  /** Activity's name */
  readonly name: string
  /** Activity type */
  readonly type: ActivityType
  /** Stream URL, is validated when type is 1 */
  readonly url?: string | null
  /** Unix timestamp (in milliseconds) of when the activity was added to the user's session */
  readonly created_at: number
  /** Unix timestamps for start and/or end of the game */
  readonly timestamps?: ActivityTimestamp
  /** Application ID for the game */
  readonly application_id?: Snowflake
  /** What the player is currently doing */
  readonly details?: string | null
  /** User's current party status, or text used for a custom status */
  readonly state?: string | null
  /** Emoji used for a custom status */
  readonly emoji?: ActivityEmoji | null
  /** Information for the current party of the player */
  readonly party?: ActivityParty
  /** Images for the presence and their hover texts */
  readonly assets?: ActivityAsset
  /** Secrets for Rich Presence joining and spectating */
  readonly secrets?: ActivitySecret
  /** Whether or not the activity is an instanced game session */
  readonly instance?: boolean
  /** Activity flags ORd together, describes what the payload includes */
  readonly flags?: number
  /** Custom buttons shown in the Rich Presence (max 2) */
  readonly buttons?: Array<ActivityButton>
}
export interface ActivityAsset {
  /** See Activity Asset Image */
  readonly large_image?: string
  /** Text displayed when hovering over the large image of the activity */
  readonly large_text?: string
  /** See Activity Asset Image */
  readonly small_image?: string
  /** Text displayed when hovering over the small image of the activity */
  readonly small_text?: string
}
export interface ActivityButton {
  /** Text shown on the button (1-32 characters) */
  readonly label: string
  /** URL opened when clicking the button (1-512 characters) */
  readonly url: string
}
export interface ActivityEmoji {
  /** Name of the emoji */
  readonly name: string
  /** ID of the emoji */
  readonly id?: Snowflake
  /** Whether the emoji is animated */
  readonly animated?: boolean
}
export const ActivityFlag = {
  INSTANCE: 1 << 0,
  JOIN: 1 << 1,
  SPECTATE: 1 << 2,
  JOIN_REQUEST: 1 << 3,
  SYNC: 1 << 4,
  PLAY: 1 << 5,
  PARTY_PRIVACY_FRIENDS: 1 << 6,
  PARTY_PRIVACY_VOICE_CHANNEL: 1 << 7,
  EMBEDDED: 1 << 8,
} as const
export interface ActivityParty {
  /** ID of the party */
  readonly id?: string
  /** Used to show the party's current and maximum size */
  readonly size?: Array<number>
}
export interface ActivitySecret {
  /** Secret for joining a party */
  readonly join?: string
  /** Secret for spectating a game */
  readonly spectate?: string
  /** Secret for a specific instanced match */
  readonly match?: string
}
export interface ActivityTimestamp {
  /** Unix time (in milliseconds) of when the activity started */
  readonly start?: number
  /** Unix time (in milliseconds) of when the activity ends */
  readonly end?: number
}
export enum ActivityType {
  GAME = 0,
  STREAMING = 1,
  LISTENING = 2,
  WATCHING = 3,
  CUSTOM = 4,
  COMPETING = 5,
}
export interface AddGuildMemberParams {
  /** an oauth2 access token granted with the guilds.join to the bot's application for the user you want to add to the guild */
  readonly access_token: string
  /** value to set user's nickname to */
  readonly nick: string
  /** array of role ids the member is assigned */
  readonly roles: Array<Snowflake>
  /** whether the user is muted in voice channels */
  readonly mute: boolean
  /** whether the user is deafened in voice channels */
  readonly deaf: boolean
}
export interface AllowedMention {
  /** An array of allowed mention types to parse from the content. */
  readonly parse: Array<AllowedMentionType>
  /** Array of role_ids to mention (Max size of 100) */
  readonly roles: Array<Snowflake>
  /** Array of user_ids to mention (Max size of 100) */
  readonly users: Array<Snowflake>
  /** For replies, whether to mention the author of the message being replied to (default false) */
  readonly replied_user: boolean
}
export enum AllowedMentionType {
  /** Controls role mentions */
  ROLE_MENTIONS = "roles",
  /** Controls user mentions */
  USER_MENTIONS = "users",
  /** Controls @everyone and @here mentions */
  EVERYONE_MENTIONS = "everyone",
}
export interface Application {
  /** ID of the app */
  readonly id: Snowflake
  /** Name of the app */
  readonly name: string
  /** Icon hash of the app */
  readonly icon?: string | null
  /** Description of the app */
  readonly description: string
  /** List of RPC origin URLs, if RPC is enabled */
  readonly rpc_origins?: Array<string>
  /** When false, only the app owner can add the app to guilds */
  readonly bot_public: boolean
  /** When true, the app's bot will only join upon completion of the full OAuth2 code grant flow */
  readonly bot_require_code_grant: boolean
  /** Partial user object for the bot user associated with the app */
  readonly bot?: User
  /** URL of the app's Terms of Service */
  readonly terms_of_service_url?: string
  /** URL of the app's Privacy Policy */
  readonly privacy_policy_url?: string
  /** Partial user object for the owner of the app */
  readonly owner?: User
  /** deprecated and will be removed in v11. An empty string. */
  readonly summary: string
  /** Hex encoded key for verification in interactions and the GameSDK's GetTicket */
  readonly verify_key: string
  /** If the app belongs to a team, this will be a list of the members of that team */
  readonly team?: Team | null
  /** Guild associated with the app. For example, a developer support server. */
  readonly guild_id?: Snowflake
  /** Partial object of the associated guild */
  readonly guild?: Guild
  /** If this app is a game sold on Discord, this field will be the id of the "Game SKU" that is created, if exists */
  readonly primary_sku_id?: Snowflake
  /** If this app is a game sold on Discord, this field will be the URL slug that links to the store page */
  readonly slug?: string
  /** App's default rich presence invite cover image hash */
  readonly cover_image?: string
  /** App's public flags */
  readonly flags?: number
  /** Approximate count of guilds the app has been added to */
  readonly approximate_guild_count?: number
  /** Array of redirect URIs for the app */
  readonly redirect_uris?: Array<string>
  /** Interactions endpoint URL for the app */
  readonly interactions_endpoint_url?: string
  /** Role connection verification URL for the app */
  readonly role_connections_verification_url?: string
  /** List of tags describing the content and functionality of the app. Max of 5 tags. */
  readonly tags?: Array<string>
  /** Settings for the app's default in-app authorization link, if enabled */
  readonly install_params?: InstallParam
  /** Default custom authorization URL for the app, if enabled */
  readonly custom_install_url?: string
}
export interface ApplicationCommand {
  /** Unique ID of command */
  readonly id: Snowflake
  /** Type of command, defaults to 1 */
  readonly type?: ApplicationCommandType
  /** ID of the parent application */
  readonly application_id: Snowflake
  /** Guild ID of the command, if not global */
  readonly guild_id?: Snowflake
  /** Name of command, 1-32 characters */
  readonly name: string
  /** Localization dictionary for name field. Values follow the same restrictions as name */
  readonly name_localizations?: Locale | null
  /** Description for CHAT_INPUT commands, 1-100 characters. Empty string for USER and MESSAGE commands */
  readonly description: string
  /** Localization dictionary for description field. Values follow the same restrictions as description */
  readonly description_localizations?: Locale | null
  /** Parameters for the command, max of 25 */
  readonly options?: Array<ApplicationCommandOption>
  /** Set of permissions represented as a bit set */
  readonly default_member_permissions?: string | null
  /** Indicates whether the command is available in DMs with the app, only for globally-scoped commands. By default, commands are visible. */
  readonly dm_permission?: boolean
  /** Not recommended for use as field will soon be deprecated. Indicates whether the command is enabled by default when the app is added to a guild, defaults to true */
  readonly default_permission?: boolean | null
  /** Indicates whether the command is age-restricted, defaults to false */
  readonly nsfw?: boolean
  /** Autoincrementing version identifier updated during substantial record changes */
  readonly version: Snowflake
}
export interface ApplicationCommandDatum {
  /** the ID of the invoked command */
  readonly id: Snowflake
  /** the name of the invoked command */
  readonly name: string
  /** the type of the invoked command */
  readonly type: number
  /** converted users + roles + channels + attachments */
  readonly resolved?: ResolvedDatum
  /** the params + values from the user */
  readonly options?: Array<ApplicationCommandInteractionDataOption>
  /** the id of the guild the command is registered to */
  readonly guild_id?: Snowflake
  /** id of the user or message targeted by a user or message command */
  readonly target_id?: Snowflake
}
export interface ApplicationCommandInteractionDataOption {
  /** Name of the parameter */
  readonly name: string
  /** Value of application command option type */
  readonly type: ApplicationCommandOptionType
  /** Value of the option resulting from user input */
  readonly value?: string
  /** Present if this option is a group or subcommand */
  readonly options?: Array<ApplicationCommandInteractionDataOption>
  /** true if this option is the currently focused option for autocomplete */
  readonly focused?: boolean
}
export interface ApplicationCommandOption {
  /** Type of option */
  readonly type: any
  /** 1-32 character name */
  readonly name: string
  /** Localization dictionary for the name field. Values follow the same restrictions as name */
  readonly name_localizations?: Locale | null
  /** 1-100 character description */
  readonly description: string
  /** Localization dictionary for the description field. Values follow the same restrictions as description */
  readonly description_localizations?: Locale | null
  /** If the parameter is required or optional--default false */
  readonly required?: boolean
  /** Choices for STRING, INTEGER, and NUMBER types for the user to pick from, max 25 */
  readonly choices?: Array<ApplicationCommandOptionChoice>
  /** If the option is a subcommand or subcommand group type, these nested options will be the parameters */
  readonly options?: Array<ApplicationCommandOption>
  /** If the option is a channel type, the channels shown will be restricted to these types */
  readonly channel_types?: Array<ChannelType>
  /** If the option is an INTEGER or NUMBER type, the minimum value permitted */
  readonly min_value?: number
  /** If the option is an INTEGER or NUMBER type, the maximum value permitted */
  readonly max_value?: number
  /** For option type STRING, the minimum allowed length (minimum of 0, maximum of 6000) */
  readonly min_length?: number
  /** For option type STRING, the maximum allowed length (minimum of 1, maximum of 6000) */
  readonly max_length?: number
  /** If autocomplete interactions are enabled for this STRING, INTEGER, or NUMBER type option */
  readonly autocomplete?: boolean
}
export interface ApplicationCommandOptionChoice {
  /** 1-100 character choice name */
  readonly name: string
  /** Localization dictionary for the name field. Values follow the same restrictions as name */
  readonly name_localizations?: Locale | null
  /** Value for the choice, up to 100 characters if string */
  readonly value: string
}
export enum ApplicationCommandOptionType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
  MENTIONABLE = 9,
  NUMBER = 10,
  ATTACHMENT = 11,
}
export interface ApplicationCommandPermission {
  /** ID of the role, user, or channel. It can also be a permission constant */
  readonly id: Snowflake
  /** role (1), user (2), or channel (3) */
  readonly type: ApplicationCommandPermissionType
  /** true to allow, false, to disallow */
  readonly permission: boolean
}
export type ApplicationCommandPermissionsUpdateEvent =
  GuildApplicationCommandPermission
export enum ApplicationCommandPermissionType {
  ROLE = 1,
  USER = 2,
  CHANNEL = 3,
}
export enum ApplicationCommandType {
  /** Slash commands; a text-based command that shows up when a user types / */
  CHAT_INPUT = 1,
  /** A UI-based command that shows up when you right click or tap on a user */
  USER = 2,
  /** A UI-based command that shows up when you right click or tap on a message */
  MESSAGE = 3,
}
export const ApplicationFlag = {
  /** Indicates if an app uses the Auto Moderation API */
  APPLICATION_AUTO_MODERATION_RULE_CREATE_BADGE: 1 << 6,
  /** Intent required for bots in 100 or more servers to receive presence_update events */
  GATEWAY_PRESENCE: 1 << 12,
  /** Intent required for bots in under 100 servers to receive presence_update events, found on the Bot page in your app's settings */
  GATEWAY_PRESENCE_LIMITED: 1 << 13,
  /** Intent required for bots in 100 or more servers to receive member-related events like guild_member_add. See the list of member-related events under GUILD_MEMBERS */
  GATEWAY_GUILD_MEMBERS: 1 << 14,
  /** Intent required for bots in under 100 servers to receive member-related events like guild_member_add, found on the Bot page in your app's settings. See the list of member-related events under GUILD_MEMBERS */
  GATEWAY_GUILD_MEMBERS_LIMITED: 1 << 15,
  /** Indicates unusual growth of an app that prevents verification */
  VERIFICATION_PENDING_GUILD_LIMIT: 1 << 16,
  /** Indicates if an app is embedded within the Discord client (currently unavailable publicly) */
  EMBEDDED: 1 << 17,
  /** Intent required for bots in 100 or more servers to receive message content */
  GATEWAY_MESSAGE_CONTENT: 1 << 18,
  /** Intent required for bots in under 100 servers to receive message content, found on the Bot page in your app's settings */
  GATEWAY_MESSAGE_CONTENT_LIMITED: 1 << 19,
  /** Indicates if an app has registered global application commands */
  APPLICATION_COMMAND_BADGE: 1 << 23,
} as const
export interface ApplicationRoleConnection {
  /** the vanity name of the platform a bot has connected (max 50 characters) */
  readonly platform_name?: string | null
  /** the username on the platform a bot has connected (max 100 characters) */
  readonly platform_username?: string | null
  /** object mapping application role connection metadata keys to their string-ified value (max 100 characters) for the user on the platform a bot has connected */
  readonly metadata: ApplicationRoleConnectionMetadatum
}
export enum ApplicationRoleConnectionMetadataType {
  /** the metadata value (integer) is less than or equal to the guild's configured value (integer) */
  INTEGER_LESS_THAN_OR_EQUAL = 1,
  /** the metadata value (integer) is greater than or equal to the guild's configured value (integer) */
  INTEGER_GREATER_THAN_OR_EQUAL = 2,
  /** the metadata value (integer) is equal to the guild's configured value (integer) */
  INTEGER_EQUAL = 3,
  /** the metadata value (integer) is not equal to the guild's configured value (integer) */
  INTEGER_NOT_EQUAL = 4,
  /** the metadata value (ISO8601 string) is less than or equal to the guild's configured value (integer; days before current date) */
  DATETIME_LESS_THAN_OR_EQUAL = 5,
  /** the metadata value (ISO8601 string) is greater than or equal to the guild's configured value (integer; days before current date) */
  DATETIME_GREATER_THAN_OR_EQUAL = 6,
  /** the metadata value (integer) is equal to the guild's configured value (integer; 1) */
  BOOLEAN_EQUAL = 7,
  /** the metadata value (integer) is not equal to the guild's configured value (integer; 1) */
  BOOLEAN_NOT_EQUAL = 8,
}
export interface ApplicationRoleConnectionMetadatum {
  /** type of metadata value */
  readonly type: ApplicationRoleConnectionMetadataType
  /** dictionary key for the metadata field (must be a-z, 0-9, or _ characters; 1-50 characters) */
  readonly key: string
  /** name of the metadata field (1-100 characters) */
  readonly name: string
  /** translations of the name */
  readonly name_localizations?: Locale
  /** description of the metadata field (1-200 characters) */
  readonly description: string
  /** translations of the description */
  readonly description_localizations?: Locale
}
export interface Attachment {
  /** attachment id */
  readonly id: Snowflake
  /** name of file attached */
  readonly filename: string
  /** description for the file (max 1024 characters) */
  readonly description?: string
  /** the attachment's media type */
  readonly content_type?: string
  /** size of file in bytes */
  readonly size: number
  /** source url of file */
  readonly url: string
  /** a proxied url of file */
  readonly proxy_url: string
  /** height of file (if image) */
  readonly height?: number | null
  /** width of file (if image) */
  readonly width?: number | null
  /** whether this attachment is ephemeral */
  readonly ephemeral?: boolean
  /** the duration of the audio file (currently for voice messages) */
  readonly duration_secs?: number
  /** base64 encoded bytearray representing a sampled waveform (currently for voice messages) */
  readonly waveform?: string
  /** attachment flags combined as a bitfield */
  readonly flags?: number
}
export const AttachmentFlag = {
  /** this attachment has been edited using the remix feature on mobile */
  IS_REMIX: 1 << 2,
} as const
export interface AuditEntryInfo {
  /** ID of the app whose permissions were targeted */
  readonly application_id: Snowflake
  /** Name of the Auto Moderation rule that was triggered */
  readonly auto_moderation_rule_name: string
  /** Trigger type of the Auto Moderation rule that was triggered */
  readonly auto_moderation_rule_trigger_type: string
  /** Channel in which the entities were targeted */
  readonly channel_id: Snowflake
  /** Number of entities that were targeted */
  readonly count: string
  /** Number of days after which inactive members were kicked */
  readonly delete_member_days: string
  /** ID of the overwritten entity */
  readonly id: Snowflake
  /** Number of members removed by the prune */
  readonly members_removed: string
  /** ID of the message that was targeted */
  readonly message_id: Snowflake
  /** Name of the role if type is "0" (not present if type is "1") */
  readonly role_name: string
  /** Type of overwritten entity - role ("0") or member ("1") */
  readonly type: string
  /** The type of integration which performed the action */
  readonly integration_type: string
}
export interface AuditLog {
  /** List of application commands referenced in the audit log */
  readonly application_commands: Array<ApplicationCommand>
  /** List of audit log entries, sorted from most to least recent */
  readonly audit_log_entries: Array<AuditLogEntry>
  /** List of auto moderation rules referenced in the audit log */
  readonly auto_moderation_rules: Array<AutoModerationRule>
  /** List of guild scheduled events referenced in the audit log */
  readonly guild_scheduled_events: Array<GuildScheduledEvent>
  /** List of partial integration objects */
  readonly integrations: Array<Integration>
  /** List of threads referenced in the audit log* */
  readonly threads: Array<Channel>
  /** List of users referenced in the audit log */
  readonly users: Array<User>
  /** List of webhooks referenced in the audit log */
  readonly webhooks: Array<Webhook>
}
export interface AuditLogChange {
  /** New value of the key */
  readonly new_value?: any
  /** Old value of the key */
  readonly old_value?: any
  /** Name of the changed entity, with a few exceptions */
  readonly key: string
}
export interface AuditLogEntry {
  /** ID of the affected entity (webhook, user, role, etc.) */
  readonly target_id?: string | null
  /** Changes made to the target_id */
  readonly changes?: Array<AuditLogChange>
  /** User or app that made the changes */
  readonly user_id?: Snowflake | null
  /** ID of the entry */
  readonly id: Snowflake
  /** Type of action that occurred */
  readonly action_type: AuditLogEvent
  /** Additional info for certain event types */
  readonly options?: AuditEntryInfo
  /** Reason for the change (1-512 characters) */
  readonly reason?: string
}
export enum AuditLogEvent {
  /** Server settings were updated */
  GUILD_UPDATE = 1,
  /** Channel was created */
  CHANNEL_CREATE = 10,
  /** Channel settings were updated */
  CHANNEL_UPDATE = 11,
  /** Channel was deleted */
  CHANNEL_DELETE = 12,
  /** Permission overwrite was added to a channel */
  CHANNEL_OVERWRITE_CREATE = 13,
  /** Permission overwrite was updated for a channel */
  CHANNEL_OVERWRITE_UPDATE = 14,
  /** Permission overwrite was deleted from a channel */
  CHANNEL_OVERWRITE_DELETE = 15,
  /** Member was removed from server */
  MEMBER_KICK = 20,
  /** Members were pruned from server */
  MEMBER_PRUNE = 21,
  /** Member was banned from server */
  MEMBER_BAN_ADD = 22,
  /** Server ban was lifted for a member */
  MEMBER_BAN_REMOVE = 23,
  /** Member was updated in server */
  MEMBER_UPDATE = 24,
  /** Member was added or removed from a role */
  MEMBER_ROLE_UPDATE = 25,
  /** Member was moved to a different voice channel */
  MEMBER_MOVE = 26,
  /** Member was disconnected from a voice channel */
  MEMBER_DISCONNECT = 27,
  /** Bot user was added to server */
  BOT_ADD = 28,
  /** Role was created */
  ROLE_CREATE = 30,
  /** Role was edited */
  ROLE_UPDATE = 31,
  /** Role was deleted */
  ROLE_DELETE = 32,
  /** Server invite was created */
  INVITE_CREATE = 40,
  /** Server invite was updated */
  INVITE_UPDATE = 41,
  /** Server invite was deleted */
  INVITE_DELETE = 42,
  /** Webhook was created */
  WEBHOOK_CREATE = 50,
  /** Webhook properties or channel were updated */
  WEBHOOK_UPDATE = 51,
  /** Webhook was deleted */
  WEBHOOK_DELETE = 52,
  /** Emoji was created */
  EMOJI_CREATE = 60,
  /** Emoji name was updated */
  EMOJI_UPDATE = 61,
  /** Emoji was deleted */
  EMOJI_DELETE = 62,
  /** Single message was deleted */
  MESSAGE_DELETE = 72,
  /** Multiple messages were deleted */
  MESSAGE_BULK_DELETE = 73,
  /** Message was pinned to a channel */
  MESSAGE_PIN = 74,
  /** Message was unpinned from a channel */
  MESSAGE_UNPIN = 75,
  /** App was added to server */
  INTEGRATION_CREATE = 80,
  /** App was updated (as an example, its scopes were updated) */
  INTEGRATION_UPDATE = 81,
  /** App was removed from server */
  INTEGRATION_DELETE = 82,
  /** Stage instance was created (stage channel becomes live) */
  STAGE_INSTANCE_CREATE = 83,
  /** Stage instance details were updated */
  STAGE_INSTANCE_UPDATE = 84,
  /** Stage instance was deleted (stage channel no longer live) */
  STAGE_INSTANCE_DELETE = 85,
  /** Sticker was created */
  STICKER_CREATE = 90,
  /** Sticker details were updated */
  STICKER_UPDATE = 91,
  /** Sticker was deleted */
  STICKER_DELETE = 92,
  /** Event was created */
  GUILD_SCHEDULED_EVENT_CREATE = 100,
  /** Event was updated */
  GUILD_SCHEDULED_EVENT_UPDATE = 101,
  /** Event was cancelled */
  GUILD_SCHEDULED_EVENT_DELETE = 102,
  /** Thread was created in a channel */
  THREAD_CREATE = 110,
  /** Thread was updated */
  THREAD_UPDATE = 111,
  /** Thread was deleted */
  THREAD_DELETE = 112,
  /** Permissions were updated for a command */
  APPLICATION_COMMAND_PERMISSION_UPDATE = 121,
  /** Auto Moderation rule was created */
  AUTO_MODERATION_RULE_CREATE = 140,
  /** Auto Moderation rule was updated */
  AUTO_MODERATION_RULE_UPDATE = 141,
  /** Auto Moderation rule was deleted */
  AUTO_MODERATION_RULE_DELETE = 142,
  /** Message was blocked by Auto Moderation */
  AUTO_MODERATION_BLOCK_MESSAGE = 143,
  /** Message was flagged by Auto Moderation */
  AUTO_MODERATION_FLAG_TO_CHANNEL = 144,
  /** Member was timed out by Auto Moderation */
  AUTO_MODERATION_USER_COMMUNICATION_DISABLED = 145,
  /** Creator monetization request was created */
  CREATOR_MONETIZATION_REQUEST_CREATED = 150,
  /** Creator monetization terms were accepted */
  CREATOR_MONETIZATION_TERMS_ACCEPTED = 151,
}
export interface AutoModerationAction {
  /** the type of action */
  readonly type: ActionType
  /** additional metadata needed during execution for this specific action type */
  readonly metadata?: ActionMetadatum
}
export interface AutoModerationActionExecutionEvent {
  /** ID of the guild in which action was executed */
  readonly guild_id: Snowflake
  /** Action which was executed */
  readonly action: AutoModerationAction
  /** ID of the rule which action belongs to */
  readonly rule_id: Snowflake
  /** Trigger type of rule which was triggered */
  readonly rule_trigger_type: TriggerType
  /** ID of the user which generated the content which triggered the rule */
  readonly user_id: Snowflake
  /** ID of the channel in which user content was posted */
  readonly channel_id?: Snowflake
  /** ID of any user message which content belongs to * */
  readonly message_id?: Snowflake
  /** ID of any system auto moderation messages posted as a result of this action ** */
  readonly alert_system_message_id?: Snowflake
  /** User-generated text content */
  readonly content: string
  /** Word or phrase configured in the rule that triggered the rule */
  readonly matched_keyword?: string | null
  /** Substring in content that triggered the rule */
  readonly matched_content?: string | null
}
export interface AutoModerationRule {
  /** the id of this rule */
  readonly id: Snowflake
  /** the id of the guild which this rule belongs to */
  readonly guild_id: Snowflake
  /** the rule name */
  readonly name: string
  /** the user which first created this rule */
  readonly creator_id: Snowflake
  /** the rule event type */
  readonly event_type: EventType
  /** the rule trigger type */
  readonly trigger_type: TriggerType
  /** the rule trigger metadata */
  readonly trigger_metadata: TriggerMetadatum
  /** the actions which will execute when the rule is triggered */
  readonly actions: Array<AutoModerationAction>
  /** whether the rule is enabled */
  readonly enabled: boolean
  /** the role ids that should not be affected by the rule (Maximum of 20) */
  readonly exempt_roles: Array<Snowflake>
  /** the channel ids that should not be affected by the rule (Maximum of 50) */
  readonly exempt_channels: Array<Snowflake>
}
export type AutoModerationRuleCreateEvent = AutoModerationRule
export type AutoModerationRuleDeleteEvent = AutoModerationRule
export type AutoModerationRuleUpdateEvent = AutoModerationRule
export interface Ban {
  /** the reason for the ban */
  readonly reason?: string | null
  /** the banned user */
  readonly user: User
}
export interface BeginGuildPruneParams {
  /** number of days to prune (1-30) */
  readonly days: number
  /** whether pruned is returned, discouraged for large guilds */
  readonly compute_prune_count: boolean
  /** role(s) to include */
  readonly include_roles: Array<Snowflake>
  /** reason for the prune (deprecated) */
  readonly reason?: string
}
export interface BulkDeleteMessageParams {
  /** an array of message ids to delete (2-100) */
  readonly messages: Array<Snowflake>
}
export interface BulkOverwriteGuildApplicationCommandParams {
  /** ID of the command, if known */
  readonly id?: Snowflake
  /** Name of command, 1-32 characters */
  readonly name: string
  /** Localization dictionary for the name field. Values follow the same restrictions as name */
  readonly name_localizations?: Locale | null
  /** 1-100 character description */
  readonly description: string
  /** Localization dictionary for the description field. Values follow the same restrictions as description */
  readonly description_localizations?: Locale | null
  /** Parameters for the command */
  readonly options?: Array<ApplicationCommandOption>
  /** Set of permissions represented as a bit set */
  readonly default_member_permissions?: string | null
  /** Indicates whether the command is available in DMs with the app, only for globally-scoped commands. By default, commands are visible. */
  readonly dm_permission?: boolean | null
  /** Replaced by default_member_permissions and will be deprecated in the future. Indicates whether the command is enabled by default when the app is added to a guild. Defaults to true */
  readonly default_permission?: boolean
  /** Type of command, defaults 1 if not set */
  readonly type?: ApplicationCommandType
  /** Indicates whether the command is age-restricted */
  readonly nsfw?: boolean
}
export interface Button {
  /** 2 for a button */
  readonly type: number
  /** A button style */
  readonly style: ButtonStyle
  /** Text that appears on the button; max 80 characters */
  readonly label?: string
  /** name, id, and animated */
  readonly emoji?: Emoji
  /** Developer-defined identifier for the button; max 100 characters */
  readonly custom_id?: string
  /** URL for link-style buttons */
  readonly url?: string
  /** Whether the button is disabled (defaults to false) */
  readonly disabled?: boolean
}
export enum ButtonStyle {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DANGER = 4,
  LINK = 5,
}
export interface Channel {
  /** the id of this channel */
  readonly id: Snowflake
  /** the type of channel */
  readonly type: ChannelType
  /** the id of the guild (may be missing for some channel objects received over gateway guild dispatches) */
  readonly guild_id?: Snowflake
  /** sorting position of the channel */
  readonly position?: number
  /** explicit permission overwrites for members and roles */
  readonly permission_overwrites?: Array<Overwrite>
  /** the name of the channel (1-100 characters) */
  readonly name?: string | null
  /** the channel topic (0-4096 characters for GUILD_FORUM and GUILD_MEDIA channels, 0-1024 characters for all others) */
  readonly topic?: string | null
  /** whether the channel is nsfw */
  readonly nsfw?: boolean
  /** the id of the last message sent in this channel (or thread for GUILD_FORUM or GUILD_MEDIA channels) (may not point to an existing or valid message or thread) */
  readonly last_message_id?: Snowflake | null
  /** the bitrate (in bits) of the voice channel */
  readonly bitrate?: number
  /** the user limit of the voice channel */
  readonly user_limit?: number
  /** amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission manage_messages or manage_channel, are unaffected */
  readonly rate_limit_per_user?: number
  /** the recipients of the DM */
  readonly recipients?: Array<User>
  /** icon hash of the group DM */
  readonly icon?: string | null
  /** id of the creator of the group DM or thread */
  readonly owner_id?: Snowflake
  /** application id of the group DM creator if it is bot-created */
  readonly application_id?: Snowflake
  /** for group DM channels: whether the channel is managed by an application via the gdm.join OAuth2 scope */
  readonly managed?: boolean
  /** for guild channels: id of the parent category for a channel (each parent category can contain up to 50 channels), for threads: id of the text channel this thread was created */
  readonly parent_id?: Snowflake | null
  /** when the last pinned message was pinned. This may be null in events such as GUILD_CREATE when a message is not pinned. */
  readonly last_pin_timestamp?: string | null
  /** voice region id for the voice channel, automatic when set to null */
  readonly rtc_region?: string | null
  /** the camera video quality mode of the voice channel, 1 when not present */
  readonly video_quality_mode?: VideoQualityMode
  /** number of messages (not including the initial message or deleted messages) in a thread. */
  readonly message_count?: number
  /** an approximate count of users in a thread, stops counting at 50 */
  readonly member_count?: number
  /** thread-specific fields not needed by other channels */
  readonly thread_metadata?: ThreadMetadatum
  /** thread member object for the current user, if they have joined the thread, only included on certain API endpoints */
  readonly member?: ThreadMember
  /** default duration, copied onto newly created threads, in minutes, threads will stop showing in the channel list after the specified period of inactivity, can be set to: 60, 1440, 4320, 10080 */
  readonly default_auto_archive_duration?: number
  /** computed permissions for the invoking user in the channel, including overwrites, only included when part of the resolved data received on a slash command interaction. This does not include implicit permissions, which may need to be checked separately */
  readonly permissions?: string
  /** channel flags combined as a bitfield */
  readonly flags?: number
  /** number of messages ever sent in a thread, it's similar to message_count on message creation, but will not decrement the number when a message is deleted */
  readonly total_message_sent?: number
  /** the set of tags that can be used in a GUILD_FORUM or a GUILD_MEDIA channel */
  readonly available_tags?: Array<ForumTag>
  /** the IDs of the set of tags that have been applied to a thread in a GUILD_FORUM or a GUILD_MEDIA channel */
  readonly applied_tags?: Array<Snowflake>
  /** the emoji to show in the add reaction button on a thread in a GUILD_FORUM or a GUILD_MEDIA channel */
  readonly default_reaction_emoji?: DefaultReaction | null
  /** the initial rate_limit_per_user to set on newly created threads in a channel. this field is copied to the thread at creation time and does not live update. */
  readonly default_thread_rate_limit_per_user?: number
  /** the default sort order type used to order posts in GUILD_FORUM and GUILD_MEDIA channels. Defaults to null, which indicates a preferred sort order hasn't been set by a channel admin */
  readonly default_sort_order?: SortOrderType | null
  /** the default forum layout view used to display posts in GUILD_FORUM channels. Defaults to 0, which indicates a layout view has not been set by a channel admin */
  readonly default_forum_layout?: ForumLayoutType
}
export type ChannelCreateEvent = Channel
export type ChannelDeleteEvent = Channel
export const ChannelFlag = {
  /** this thread is pinned to the top of its parent GUILD_FORUM or GUILD_MEDIA channel */
  PINNED: 1 << 1,
  /** whether a tag is required to be specified when creating a thread in a GUILD_FORUM or a GUILD_MEDIA channel. Tags are specified in the applied_tags field. */
  REQUIRE_TAG: 1 << 4,
  /** when set hides the embedded media download options. Available only for media channels */
  HIDE_MEDIA_DOWNLOAD_OPTIONS: 1 << 15,
} as const
export interface ChannelMention {
  /** id of the channel */
  readonly id: Snowflake
  /** id of the guild containing the channel */
  readonly guild_id: Snowflake
  /** the type of channel */
  readonly type: ChannelType
  /** the name of the channel */
  readonly name: string
}
export interface ChannelPinsUpdateEvent {
  /** ID of the guild */
  readonly guild_id?: Snowflake
  /** ID of the channel */
  readonly channel_id: Snowflake
  /** Time at which the most recent pinned message was pinned */
  readonly last_pin_timestamp?: string | null
}
export enum ChannelType {
  /** a text channel within a server */
  GUILD_TEXT = 0,
  /** a direct message between users */
  DM = 1,
  /** a voice channel within a server */
  GUILD_VOICE = 2,
  /** a direct message between multiple users */
  GROUP_DM = 3,
  /** an organizational category that contains up to 50 channels */
  GUILD_CATEGORY = 4,
  /** a channel that users can follow and crosspost into their own server (formerly news channels) */
  GUILD_ANNOUNCEMENT = 5,
  /** a temporary sub-channel within a GUILD_ANNOUNCEMENT channel */
  ANNOUNCEMENT_THREAD = 10,
  /** a temporary sub-channel within a GUILD_TEXT or GUILD_FORUM channel */
  PUBLIC_THREAD = 11,
  /** a temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission */
  PRIVATE_THREAD = 12,
  /** a voice channel for hosting events with an audience */
  GUILD_STAGE_VOICE = 13,
  /** the channel in a hub containing the listed servers */
  GUILD_DIRECTORY = 14,
  /** Channel that can only contain threads */
  GUILD_FORUM = 15,
  /** Channel that can only contain threads, similar to GUILD_FORUM channels */
  GUILD_MEDIA = 16,
}
export type ChannelUpdateEvent = Channel
export interface ClientStatus {
  /** User's status set for an active desktop (Windows, Linux, Mac) application session */
  readonly desktop?: string
  /** User's status set for an active mobile (iOS, Android) application session */
  readonly mobile?: string
  /** User's status set for an active web (browser, bot user) application session */
  readonly web?: string
}
export type Component = ActionRow | Button | TextInput | SelectMenu
export enum ComponentType {
  /** Container for other components */
  ACTION_ROW = 1,
  /** Button object */
  BUTTON = 2,
  /** Select menu for picking from defined text options */
  STRING_SELECT = 3,
  /** Text input object */
  TEXT_INPUT = 4,
  /** Select menu for users */
  USER_SELECT = 5,
  /** Select menu for roles */
  ROLE_SELECT = 6,
  /** Select menu for mentionables (users and roles) */
  MENTIONABLE_SELECT = 7,
  /** Select menu for channels */
  CHANNEL_SELECT = 8,
}
export interface Connection {
  /** id of the connection account */
  readonly id: string
  /** the username of the connection account */
  readonly name: string
  /** the service of this connection */
  readonly type: string
  /** whether the connection is revoked */
  readonly revoked?: boolean
  /** an array of partial server integrations */
  readonly integrations?: Array<Integration>
  /** whether the connection is verified */
  readonly verified: boolean
  /** whether friend sync is enabled for this connection */
  readonly friend_sync: boolean
  /** whether activities related to this connection will be shown in presence updates */
  readonly show_activity: boolean
  /** whether this connection has a corresponding third party OAuth2 token */
  readonly two_way_link: boolean
  /** visibility of this connection */
  readonly visibility: VisibilityType
}
export interface CreateAutoModerationRuleParams {
  /** the rule name */
  readonly name: string
  /** the event type */
  readonly event_type: EventType
  /** the trigger type */
  readonly trigger_type: TriggerType
  /** the trigger metadata */
  readonly trigger_metadata?: TriggerMetadatum
  /** the actions which will execute when the rule is triggered */
  readonly actions: Array<AutoModerationAction>
  /** whether the rule is enabled (False by default) */
  readonly enabled?: boolean
  /** the role ids that should not be affected by the rule (Maximum of 20) */
  readonly exempt_roles?: Array<Snowflake>
  /** the channel ids that should not be affected by the rule (Maximum of 50) */
  readonly exempt_channels?: Array<Snowflake>
}
export interface CreateChannelInviteParams {
  /** duration of invite in seconds before expiry, or 0 for never. between 0 and 604800 (7 days) */
  readonly max_age: number
  /** max number of uses or 0 for unlimited. between 0 and 100 */
  readonly max_uses: number
  /** whether this invite only grants temporary membership */
  readonly temporary: boolean
  /** if true, don't try to reuse a similar invite (useful for creating many unique one time use invites) */
  readonly unique: boolean
  /** the type of target for this voice channel invite */
  readonly target_type: InviteTargetType
  /** the id of the user whose stream to display for this invite, required if target_type is 1, the user must be streaming in the channel */
  readonly target_user_id: Snowflake
  /** the id of the embedded application to open for this invite, required if target_type is 2, the application must have the EMBEDDED flag */
  readonly target_application_id: Snowflake
}
export interface CreateDmParams {
  /** the recipient to open a DM channel with */
  readonly recipient_id: Snowflake
}
export interface CreateGlobalApplicationCommandParams {
  /** Name of command, 1-32 characters */
  readonly name: string
  /** Localization dictionary for the name field. Values follow the same restrictions as name */
  readonly name_localizations?: Locale | null
  /** 1-100 character description for CHAT_INPUT commands */
  readonly description?: string
  /** Localization dictionary for the description field. Values follow the same restrictions as description */
  readonly description_localizations?: Locale | null
  /** the parameters for the command */
  readonly options?: Array<ApplicationCommandOption>
  /** Set of permissions represented as a bit set */
  readonly default_member_permissions?: string | null
  /** Indicates whether the command is available in DMs with the app, only for globally-scoped commands. By default, commands are visible. */
  readonly dm_permission?: boolean | null
  /** Replaced by default_member_permissions and will be deprecated in the future. Indicates whether the command is enabled by default when the app is added to a guild. Defaults to true */
  readonly default_permission?: boolean
  /** Type of command, defaults 1 if not set */
  readonly type?: ApplicationCommandType
  /** Indicates whether the command is age-restricted */
  readonly nsfw?: boolean
}
export interface CreateGroupDmParams {
  /** access tokens of users that have granted your app the gdm.join scope */
  readonly access_tokens: Array<string>
  /** a dictionary of user ids to their respective nicknames */
  readonly nicks: Record<string, string>
}
export interface CreateGuildApplicationCommandParams {
  /** Name of command, 1-32 characters */
  readonly name: string
  /** Localization dictionary for the name field. Values follow the same restrictions as name */
  readonly name_localizations?: Locale | null
  /** 1-100 character description for CHAT_INPUT commands */
  readonly description?: string
  /** Localization dictionary for the description field. Values follow the same restrictions as description */
  readonly description_localizations?: Locale | null
  /** Parameters for the command */
  readonly options?: Array<ApplicationCommandOption>
  /** Set of permissions represented as a bit set */
  readonly default_member_permissions?: string | null
  /** Replaced by default_member_permissions and will be deprecated in the future. Indicates whether the command is enabled by default when the app is added to a guild. Defaults to true */
  readonly default_permission?: boolean
  /** Type of command, defaults 1 if not set */
  readonly type?: ApplicationCommandType
  /** Indicates whether the command is age-restricted */
  readonly nsfw?: boolean
}
export interface CreateGuildBanParams {
  /** number of days to delete messages for (0-7) (deprecated) */
  readonly delete_message_days?: number
  /** number of seconds to delete messages for, between 0 and 604800 (7 days) */
  readonly delete_message_seconds?: number
}
export interface CreateGuildChannelParams {
  /** channel name (1-100 characters) */
  readonly name: string
  /** the type of channel */
  readonly type: ChannelType
  /** channel topic (0-1024 characters) */
  readonly topic: string
  /** the bitrate (in bits) of the voice or stage channel; min 8000 */
  readonly bitrate: number
  /** the user limit of the voice channel */
  readonly user_limit: number
  /** amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission manage_messages or manage_channel, are unaffected */
  readonly rate_limit_per_user: number
  /** sorting position of the channel */
  readonly position: number
  /** the channel's permission overwrites */
  readonly permission_overwrites: Array<Overwrite>
  /** id of the parent category for a channel */
  readonly parent_id: Snowflake
  /** whether the channel is nsfw */
  readonly nsfw: boolean
  /** channel voice region id of the voice or stage channel, automatic when set to null */
  readonly rtc_region: string
  /** the camera video quality mode of the voice channel */
  readonly video_quality_mode: VideoQualityMode
  /** the default duration that the clients use (not the API) for newly created threads in the channel, in minutes, to automatically archive the thread after recent activity */
  readonly default_auto_archive_duration: number
  /** emoji to show in the add reaction button on a thread in a GUILD_FORUM or a GUILD_MEDIA channel */
  readonly default_reaction_emoji: DefaultReaction
  /** set of tags that can be used in a GUILD_FORUM or a GUILD_MEDIA channel */
  readonly available_tags: Array<ForumTag>
  /** the default sort order type used to order posts in GUILD_FORUM and GUILD_MEDIA channels */
  readonly default_sort_order: SortOrderType
  /** the default forum layout view used to display posts in GUILD_FORUM channels */
  readonly default_forum_layout: ForumLayoutType
  /** the initial rate_limit_per_user to set on newly created threads in a channel. this field is copied to the thread at creation time and does not live update. */
  readonly default_thread_rate_limit_per_user: number
}
export interface CreateGuildEmojiParams {
  /** name of the emoji */
  readonly name: string
  /** the 128x128 emoji image */
  readonly image: string
  /** roles allowed to use this emoji */
  readonly roles: Array<Snowflake>
}
export interface CreateGuildFromGuildTemplateParams {
  /** name of the guild (2-100 characters) */
  readonly name: string
  /** base64 128x128 image for the guild icon */
  readonly icon?: string
}
export interface CreateGuildParams {
  /** name of the guild (2-100 characters) */
  readonly name: string
  /** voice region id (deprecated) */
  readonly region?: string | null
  /** base64 128x128 image for the guild icon */
  readonly icon?: string
  /** verification level */
  readonly verification_level?: VerificationLevel
  /** default message notification level */
  readonly default_message_notifications?: DefaultMessageNotificationLevel
  /** explicit content filter level */
  readonly explicit_content_filter?: ExplicitContentFilterLevel
  /** new guild roles */
  readonly roles?: Array<Role>
  /** new guild's channels */
  readonly channels?: Array<Channel>
  /** id for afk channel */
  readonly afk_channel_id?: Snowflake
  /** afk timeout in seconds, can be set to: 60, 300, 900, 1800, 3600 */
  readonly afk_timeout?: number
  /** the id of the channel where guild notices such as welcome messages and boost events are posted */
  readonly system_channel_id?: Snowflake
  /** system channel flags */
  readonly system_channel_flags?: number
}
export interface CreateGuildRoleParams {
  /** name of the role, max 100 characters */
  readonly name: string
  /** bitwise value of the enabled/disabled permissions */
  readonly permissions: string
  /** RGB color value */
  readonly color: number
  /** whether the role should be displayed separately in the sidebar */
  readonly hoist: boolean
  /** the role's icon image (if the guild has the ROLE_ICONS feature) */
  readonly icon?: string | null
  /** the role's unicode emoji as a standard emoji (if the guild has the ROLE_ICONS feature) */
  readonly unicode_emoji?: string | null
  /** whether the role should be mentionable */
  readonly mentionable: boolean
}
export interface CreateGuildScheduledEventParams {
  /** the channel id of the scheduled event. */
  readonly channel_id?: Snowflake
  /** the entity metadata of the scheduled event */
  readonly entity_metadata?: GuildScheduledEventEntityMetadatum
  /** the name of the scheduled event */
  readonly name: string
  /** the privacy level of the scheduled event */
  readonly privacy_level: GuildScheduledEventPrivacyLevel
  /** the time to schedule the scheduled event */
  readonly scheduled_start_time: string
  /** the time when the scheduled event is scheduled to end */
  readonly scheduled_end_time?: string
  /** the description of the scheduled event */
  readonly description?: string
  /** the entity type of the scheduled event */
  readonly entity_type: GuildScheduledEventEntityType
  /** the cover image of the scheduled event */
  readonly image?: string
}
export interface CreateGuildStickerParams {
  /** name of the sticker (2-30 characters) */
  readonly name: string
  /** description of the sticker (empty or 2-100 characters) */
  readonly description: string
  /** autocomplete/suggestion tags for the sticker (max 200 characters) */
  readonly tags: string
  /** the sticker file to upload, must be a PNG, APNG, GIF, or Lottie JSON file, max 512 KiB */
  readonly file: string
}
export interface CreateGuildTemplateParams {
  /** name of the template (1-100 characters) */
  readonly name: string
  /** description for the template (0-120 characters) */
  readonly description?: string | null
}
export interface CreateMessageParams {
  /** Message contents (up to 2000 characters) */
  readonly content?: string
  /** Can be used to verify a message was sent (up to 25 characters). Value will appear in the Message Create event. */
  readonly nonce?: string
  /** true if this is a TTS message */
  readonly tts?: boolean
  /** Up to 10 rich embeds (up to 6000 characters) */
  readonly embeds?: Array<Embed>
  /** Allowed mentions for the message */
  readonly allowed_mentions?: AllowedMention
  /** Include to make your message a reply */
  readonly message_reference?: MessageReference
  /** Components to include with the message */
  readonly components?: Array<Component>
  /** IDs of up to 3 stickers in the server to send in the message */
  readonly sticker_ids?: Array<Snowflake>
  /** Contents of the file being sent. See Uploading Files */
  readonly files?: string
  /** JSON-encoded body of non-file params, only for multipart/form-data requests. See Uploading Files */
  readonly payload_json?: string
  /** Attachment objects with filename and description. See Uploading Files */
  readonly attachments?: Array<Attachment>
  /** Message flags combined as a bitfield (only SUPPRESS_EMBEDS and SUPPRESS_NOTIFICATIONS can be set) */
  readonly flags?: number
}
export function createRoutes<O = any>(
  fetch: <R, P>(route: Route<P, O>) => RestResponse<R>,
): Endpoints<O> {
  return {
    addGuildMember: (guildId, userId, params, options) =>
      fetch({
        method: "PUT",
        url: `/guilds/${guildId}/members/${userId}`,
        params,
        options,
      }),
    addGuildMemberRole: (guildId, userId, roleId, options) =>
      fetch({
        method: "PUT",
        url: `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
        options,
      }),
    addThreadMember: (channelId, userId, options) =>
      fetch({
        method: "PUT",
        url: `/channels/${channelId}/thread-members/${userId}`,
        options,
      }),
    batchEditApplicationCommandPermissions: (applicationId, guildId, options) =>
      fetch({
        method: "PUT",
        url: `/applications/${applicationId}/guilds/${guildId}/commands/permissions`,
        options,
      }),
    beginGuildPrune: (guildId, params, options) =>
      fetch({
        method: "POST",
        url: `/guilds/${guildId}/prune`,
        params,
        options,
      }),
    bulkDeleteMessages: (channelId, params, options) =>
      fetch({
        method: "POST",
        url: `/channels/${channelId}/messages/bulk-delete`,
        params,
        options,
      }),
    bulkOverwriteGlobalApplicationCommands: (applicationId, options) =>
      fetch({
        method: "PUT",
        url: `/applications/${applicationId}/commands`,
        options,
      }),
    bulkOverwriteGuildApplicationCommands: (
      applicationId,
      guildId,
      params,
      options,
    ) =>
      fetch({
        method: "PUT",
        url: `/applications/${applicationId}/guilds/${guildId}/commands`,
        params,
        options,
      }),
    createAutoModerationRule: (guildId, params, options) =>
      fetch({
        method: "POST",
        url: `/guilds/${guildId}/auto-moderation/rules`,
        params,
        options,
      }),
    createChannelInvite: (channelId, params, options) =>
      fetch({
        method: "POST",
        url: `/channels/${channelId}/invites`,
        params,
        options,
      }),
    createDm: (params, options) =>
      fetch({
        method: "POST",
        url: `/users/@me/channels`,
        params,
        options,
      }),
    createFollowupMessage: (applicationId, interactionToken, params, options) =>
      fetch({
        method: "POST",
        url: `/webhooks/${applicationId}/${interactionToken}`,
        params,
        options,
      }),
    createGlobalApplicationCommand: (applicationId, params, options) =>
      fetch({
        method: "POST",
        url: `/applications/${applicationId}/commands`,
        params,
        options,
      }),
    createGroupDm: (params, options) =>
      fetch({
        method: "POST",
        url: `/users/@me/channels`,
        params,
        options,
      }),
    createGuild: (params, options) =>
      fetch({
        method: "POST",
        url: `/guilds`,
        params,
        options,
      }),
    createGuildApplicationCommand: (applicationId, guildId, params, options) =>
      fetch({
        method: "POST",
        url: `/applications/${applicationId}/guilds/${guildId}/commands`,
        params,
        options,
      }),
    createGuildBan: (guildId, userId, params, options) =>
      fetch({
        method: "PUT",
        url: `/guilds/${guildId}/bans/${userId}`,
        params,
        options,
      }),
    createGuildChannel: (guildId, params, options) =>
      fetch({
        method: "POST",
        url: `/guilds/${guildId}/channels`,
        params,
        options,
      }),
    createGuildEmoji: (guildId, params, options) =>
      fetch({
        method: "POST",
        url: `/guilds/${guildId}/emojis`,
        params,
        options,
      }),
    createGuildFromGuildTemplate: (templateCode, params, options) =>
      fetch({
        method: "POST",
        url: `/guilds/templates/${templateCode}`,
        params,
        options,
      }),
    createGuildRole: (guildId, params, options) =>
      fetch({
        method: "POST",
        url: `/guilds/${guildId}/roles`,
        params,
        options,
      }),
    createGuildScheduledEvent: (guildId, params, options) =>
      fetch({
        method: "POST",
        url: `/guilds/${guildId}/scheduled-events`,
        params,
        options,
      }),
    createGuildSticker: (guildId, params, options) =>
      fetch({
        method: "POST",
        url: `/guilds/${guildId}/stickers`,
        params,
        options,
      }),
    createGuildTemplate: (guildId, params, options) =>
      fetch({
        method: "POST",
        url: `/guilds/${guildId}/templates`,
        params,
        options,
      }),
    createInteractionResponse: (
      interactionId,
      interactionToken,
      params,
      options,
    ) =>
      fetch({
        method: "POST",
        url: `/interactions/${interactionId}/${interactionToken}/callback`,
        params,
        options,
      }),
    createMessage: (channelId, params, options) =>
      fetch({
        method: "POST",
        url: `/channels/${channelId}/messages`,
        params,
        options,
      }),
    createReaction: (channelId, messageId, emoji, options) =>
      fetch({
        method: "PUT",
        url: `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`,
        options,
      }),
    createStageInstance: (params, options) =>
      fetch({
        method: "POST",
        url: `/stage-instances`,
        params,
        options,
      }),
    createTestEntitlement: (applicationId, options) =>
      fetch({
        method: "POST",
        url: `/applications/${applicationId}/entitlements`,
        options,
      }),
    createWebhook: (channelId, params, options) =>
      fetch({
        method: "POST",
        url: `/channels/${channelId}/webhooks`,
        params,
        options,
      }),
    crosspostMessage: (channelId, messageId, options) =>
      fetch({
        method: "POST",
        url: `/channels/${channelId}/messages/${messageId}/crosspost`,
        options,
      }),
    deleteAllReactions: (channelId, messageId, options) =>
      fetch({
        method: "DELETE",
        url: `/channels/${channelId}/messages/${messageId}/reactions`,
        options,
      }),
    deleteAllReactionsForEmoji: (channelId, messageId, emoji, options) =>
      fetch({
        method: "DELETE",
        url: `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`,
        options,
      }),
    deleteAutoModerationRule: (guildId, autoModerationRuleId, options) =>
      fetch({
        method: "DELETE",
        url: `/guilds/${guildId}/auto-moderation/rules/${autoModerationRuleId}`,
        options,
      }),
    deleteChannelPermission: (channelId, overwriteId, options) =>
      fetch({
        method: "DELETE",
        url: `/channels/${channelId}/permissions/${overwriteId}`,
        options,
      }),
    deletecloseChannel: (channelId, options) =>
      fetch({
        method: "DELETE",
        url: `/channels/${channelId}`,
        options,
      }),
    deleteFollowupMessage: (
      applicationId,
      interactionToken,
      messageId,
      options,
    ) =>
      fetch({
        method: "DELETE",
        url: `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`,
        options,
      }),
    deleteGlobalApplicationCommand: (applicationId, commandId, options) =>
      fetch({
        method: "DELETE",
        url: `/applications/${applicationId}/commands/${commandId}`,
        options,
      }),
    deleteGuild: (guildId, options) =>
      fetch({
        method: "DELETE",
        url: `/guilds/${guildId}`,
        options,
      }),
    deleteGuildApplicationCommand: (
      applicationId,
      guildId,
      commandId,
      options,
    ) =>
      fetch({
        method: "DELETE",
        url: `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
        options,
      }),
    deleteGuildEmoji: (guildId, emojiId, options) =>
      fetch({
        method: "DELETE",
        url: `/guilds/${guildId}/emojis/${emojiId}`,
        options,
      }),
    deleteGuildIntegration: (guildId, integrationId, options) =>
      fetch({
        method: "DELETE",
        url: `/guilds/${guildId}/integrations/${integrationId}`,
        options,
      }),
    deleteGuildRole: (guildId, roleId, options) =>
      fetch({
        method: "DELETE",
        url: `/guilds/${guildId}/roles/${roleId}`,
        options,
      }),
    deleteGuildScheduledEvent: (guildId, guildScheduledEventId, options) =>
      fetch({
        method: "DELETE",
        url: `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}`,
        options,
      }),
    deleteGuildSticker: (guildId, stickerId, options) =>
      fetch({
        method: "DELETE",
        url: `/guilds/${guildId}/stickers/${stickerId}`,
        options,
      }),
    deleteGuildTemplate: (guildId, templateCode, options) =>
      fetch({
        method: "DELETE",
        url: `/guilds/${guildId}/templates/${templateCode}`,
        options,
      }),
    deleteInvite: (inviteCode, options) =>
      fetch({
        method: "DELETE",
        url: `/invites/${inviteCode}`,
        options,
      }),
    deleteMessage: (channelId, messageId, options) =>
      fetch({
        method: "DELETE",
        url: `/channels/${channelId}/messages/${messageId}`,
        options,
      }),
    deleteOriginalInteractionResponse: (
      applicationId,
      interactionToken,
      options,
    ) =>
      fetch({
        method: "DELETE",
        url: `/webhooks/${applicationId}/${interactionToken}/messages/@original`,
        options,
      }),
    deleteOwnReaction: (channelId, messageId, emoji, options) =>
      fetch({
        method: "DELETE",
        url: `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`,
        options,
      }),
    deleteStageInstance: (channelId, options) =>
      fetch({
        method: "DELETE",
        url: `/stage-instances/${channelId}`,
        options,
      }),
    deleteTestEntitlement: (applicationId, entitlementId, options) =>
      fetch({
        method: "DELETE",
        url: `/applications/${applicationId}/entitlements/${entitlementId}`,
        options,
      }),
    deleteUserReaction: (channelId, messageId, emoji, userId, options) =>
      fetch({
        method: "DELETE",
        url: `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/${userId}`,
        options,
      }),
    deleteWebhook: (webhookId, options) =>
      fetch({
        method: "DELETE",
        url: `/webhooks/${webhookId}`,
        options,
      }),
    deleteWebhookMessage: (
      webhookId,
      webhookToken,
      messageId,
      params,
      options,
    ) =>
      fetch({
        method: "DELETE",
        url: `/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`,
        params,
        options,
      }),
    deleteWebhookWithToken: (webhookId, webhookToken, options) =>
      fetch({
        method: "DELETE",
        url: `/webhooks/${webhookId}/${webhookToken}`,
        options,
      }),
    editApplicationCommandPermissions: (
      applicationId,
      guildId,
      commandId,
      params,
      options,
    ) =>
      fetch({
        method: "PUT",
        url: `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`,
        params,
        options,
      }),
    editChannelPermissions: (channelId, overwriteId, params, options) =>
      fetch({
        method: "PUT",
        url: `/channels/${channelId}/permissions/${overwriteId}`,
        params,
        options,
      }),
    editCurrentApplication: (params, options) =>
      fetch({
        method: "PATCH",
        url: `/applications/@me`,
        params,
        options,
      }),
    editFollowupMessage: (
      applicationId,
      interactionToken,
      messageId,
      params,
      options,
    ) =>
      fetch({
        method: "PATCH",
        url: `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`,
        params,
        options,
      }),
    editGlobalApplicationCommand: (applicationId, commandId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/applications/${applicationId}/commands/${commandId}`,
        params,
        options,
      }),
    editGuildApplicationCommand: (
      applicationId,
      guildId,
      commandId,
      params,
      options,
    ) =>
      fetch({
        method: "PATCH",
        url: `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
        params,
        options,
      }),
    editMessage: (channelId, messageId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/channels/${channelId}/messages/${messageId}`,
        params,
        options,
      }),
    editOriginalInteractionResponse: (
      applicationId,
      interactionToken,
      params,
      options,
    ) =>
      fetch({
        method: "PATCH",
        url: `/webhooks/${applicationId}/${interactionToken}/messages/@original`,
        params,
        options,
      }),
    editWebhookMessage: (webhookId, webhookToken, messageId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`,
        params,
        options,
      }),
    executeGitHubCompatibleWebhook: (webhookId, webhookToken, options) =>
      fetch({
        method: "POST",
        url: `/webhooks/${webhookId}/${webhookToken}/github`,
        options,
      }),
    executeSlackCompatibleWebhook: (webhookId, webhookToken, options) =>
      fetch({
        method: "POST",
        url: `/webhooks/${webhookId}/${webhookToken}/slack`,
        options,
      }),
    executeWebhook: (webhookId, webhookToken, params, options) =>
      fetch({
        method: "POST",
        url: `/webhooks/${webhookId}/${webhookToken}`,
        params,
        options,
      }),
    followAnnouncementChannel: (channelId, params, options) =>
      fetch({
        method: "POST",
        url: `/channels/${channelId}/followers`,
        params,
        options,
      }),
    getApplicationCommandPermissions: (
      applicationId,
      guildId,
      commandId,
      options,
    ) =>
      fetch({
        method: "GET",
        url: `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`,
        options,
      }),
    getApplicationRoleConnectionMetadataRecords: (applicationId, options) =>
      fetch({
        method: "GET",
        url: `/applications/${applicationId}/role-connections/metadata`,
        options,
      }),
    getAutoModerationRule: (guildId, autoModerationRuleId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/auto-moderation/rules/${autoModerationRuleId}`,
        options,
      }),
    getChannel: (channelId, options) =>
      fetch({
        method: "GET",
        url: `/channels/${channelId}`,
        options,
      }),
    getChannelInvites: (channelId, options) =>
      fetch({
        method: "GET",
        url: `/channels/${channelId}/invites`,
        options,
      }),
    getChannelMessage: (channelId, messageId, options) =>
      fetch({
        method: "GET",
        url: `/channels/${channelId}/messages/${messageId}`,
        options,
      }),
    getChannelMessages: (channelId, params, options) =>
      fetch({
        method: "GET",
        url: `/channels/${channelId}/messages`,
        params,
        options,
      }),
    getChannelWebhooks: (channelId, options) =>
      fetch({
        method: "GET",
        url: `/channels/${channelId}/webhooks`,
        options,
      }),
    getCurrentApplication: options =>
      fetch({
        method: "GET",
        url: `/applications/@me`,
        options,
      }),
    getCurrentAuthorizationInformation: options =>
      fetch({
        method: "GET",
        url: `/oauth2/@me`,
        options,
      }),
    getCurrentBotApplicationInformation: options =>
      fetch({
        method: "GET",
        url: `/oauth2/applications/@me`,
        options,
      }),
    getCurrentUser: options =>
      fetch({
        method: "GET",
        url: `/users/@me`,
        options,
      }),
    getCurrentUserApplicationRoleConnection: (applicationId, options) =>
      fetch({
        method: "GET",
        url: `/users/@me/applications/${applicationId}/role-connection`,
        options,
      }),
    getCurrentUserConnections: options =>
      fetch({
        method: "GET",
        url: `/users/@me/connections`,
        options,
      }),
    getCurrentUserGuildMember: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/users/@me/guilds/${guildId}/member`,
        options,
      }),
    getCurrentUserGuilds: (params, options) =>
      fetch({
        method: "GET",
        url: `/users/@me/guilds`,
        params,
        options,
      }),
    getFollowupMessage: (
      applicationId,
      interactionToken,
      messageId,
      params,
      options,
    ) =>
      fetch({
        method: "GET",
        url: `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`,
        params,
        options,
      }),
    getGateway: options =>
      fetch({
        method: "GET",
        url: `/gateway`,
        options,
      }),
    getGatewayBot: options =>
      fetch({
        method: "GET",
        url: `/gateway/bot`,
        options,
      }),
    getGlobalApplicationCommand: (applicationId, commandId, options) =>
      fetch({
        method: "GET",
        url: `/applications/${applicationId}/commands/${commandId}`,
        options,
      }),
    getGlobalApplicationCommands: (applicationId, params, options) =>
      fetch({
        method: "GET",
        url: `/applications/${applicationId}/commands`,
        params,
        options,
      }),
    getGuild: (guildId, params, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}`,
        params,
        options,
      }),
    getGuildApplicationCommand: (applicationId, guildId, commandId, options) =>
      fetch({
        method: "GET",
        url: `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
        options,
      }),
    getGuildApplicationCommandPermissions: (applicationId, guildId, options) =>
      fetch({
        method: "GET",
        url: `/applications/${applicationId}/guilds/${guildId}/commands/permissions`,
        options,
      }),
    getGuildApplicationCommands: (applicationId, guildId, params, options) =>
      fetch({
        method: "GET",
        url: `/applications/${applicationId}/guilds/${guildId}/commands`,
        params,
        options,
      }),
    getGuildAuditLog: (guildId, params, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/audit-logs`,
        params,
        options,
      }),
    getGuildBan: (guildId, userId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/bans/${userId}`,
        options,
      }),
    getGuildBans: (guildId, params, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/bans`,
        params,
        options,
      }),
    getGuildChannels: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/channels`,
        options,
      }),
    getGuildEmoji: (guildId, emojiId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/emojis/${emojiId}`,
        options,
      }),
    getGuildIntegrations: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/integrations`,
        options,
      }),
    getGuildInvites: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/invites`,
        options,
      }),
    getGuildMember: (guildId, userId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/members/${userId}`,
        options,
      }),
    getGuildOnboarding: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/onboarding`,
        options,
      }),
    getGuildPreview: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/preview`,
        options,
      }),
    getGuildPruneCount: (guildId, params, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/prune`,
        params,
        options,
      }),
    getGuildRoles: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/roles`,
        options,
      }),
    getGuildScheduledEvent: (guildId, guildScheduledEventId, params, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}`,
        params,
        options,
      }),
    getGuildScheduledEventUsers: (
      guildId,
      guildScheduledEventId,
      params,
      options,
    ) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}/users`,
        params,
        options,
      }),
    getGuildSticker: (guildId, stickerId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/stickers/${stickerId}`,
        options,
      }),
    getGuildTemplate: (templateCode, options) =>
      fetch({
        method: "GET",
        url: `/guilds/templates/${templateCode}`,
        options,
      }),
    getGuildTemplates: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/templates`,
        options,
      }),
    getGuildVanityUrl: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/vanity-url`,
        options,
      }),
    getGuildVoiceRegions: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/regions`,
        options,
      }),
    getGuildWebhooks: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/webhooks`,
        options,
      }),
    getGuildWelcomeScreen: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/welcome-screen`,
        options,
      }),
    getGuildWidget: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/widget.json`,
        options,
      }),
    getGuildWidgetImage: (guildId, params, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/widget.png`,
        params,
        options,
      }),
    getGuildWidgetSettings: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/widget`,
        options,
      }),
    getInvite: (inviteCode, params, options) =>
      fetch({
        method: "GET",
        url: `/invites/${inviteCode}`,
        params,
        options,
      }),
    getOriginalInteractionResponse: (
      applicationId,
      interactionToken,
      params,
      options,
    ) =>
      fetch({
        method: "GET",
        url: `/webhooks/${applicationId}/${interactionToken}/messages/@original`,
        params,
        options,
      }),
    getPinnedMessages: (channelId, options) =>
      fetch({
        method: "GET",
        url: `/channels/${channelId}/pins`,
        options,
      }),
    getReactions: (channelId, messageId, emoji, params, options) =>
      fetch({
        method: "GET",
        url: `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`,
        params,
        options,
      }),
    getStageInstance: (channelId, options) =>
      fetch({
        method: "GET",
        url: `/stage-instances/${channelId}`,
        options,
      }),
    getSticker: (stickerId, options) =>
      fetch({
        method: "GET",
        url: `/stickers/${stickerId}`,
        options,
      }),
    getThreadMember: (channelId, userId, params, options) =>
      fetch({
        method: "GET",
        url: `/channels/${channelId}/thread-members/${userId}`,
        params,
        options,
      }),
    getUser: (userId, options) =>
      fetch({
        method: "GET",
        url: `/users/${userId}`,
        options,
      }),
    getWebhook: (webhookId, options) =>
      fetch({
        method: "GET",
        url: `/webhooks/${webhookId}`,
        options,
      }),
    getWebhookMessage: (webhookId, webhookToken, messageId, params, options) =>
      fetch({
        method: "GET",
        url: `/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`,
        params,
        options,
      }),
    getWebhookWithToken: (webhookId, webhookToken, options) =>
      fetch({
        method: "GET",
        url: `/webhooks/${webhookId}/${webhookToken}`,
        options,
      }),
    groupDmAddRecipient: (channelId, userId, params, options) =>
      fetch({
        method: "PUT",
        url: `/channels/${channelId}/recipients/${userId}`,
        params,
        options,
      }),
    groupDmRemoveRecipient: (channelId, userId, options) =>
      fetch({
        method: "DELETE",
        url: `/channels/${channelId}/recipients/${userId}`,
        options,
      }),
    joinThread: (channelId, options) =>
      fetch({
        method: "PUT",
        url: `/channels/${channelId}/thread-members/@me`,
        options,
      }),
    leaveGuild: (guildId, options) =>
      fetch({
        method: "DELETE",
        url: `/users/@me/guilds/${guildId}`,
        options,
      }),
    leaveThread: (channelId, options) =>
      fetch({
        method: "DELETE",
        url: `/channels/${channelId}/thread-members/@me`,
        options,
      }),
    listActiveGuildThreads: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/threads/active`,
        options,
      }),
    listAutoModerationRulesForGuild: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/auto-moderation/rules`,
        options,
      }),
    listEntitlements: (applicationId, options) =>
      fetch({
        method: "GET",
        url: `/applications/${applicationId}/entitlements`,
        options,
      }),
    listGuildEmojis: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/emojis`,
        options,
      }),
    listGuildMembers: (guildId, params, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/members`,
        params,
        options,
      }),
    listGuildStickers: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/stickers`,
        options,
      }),
    listJoinedPrivateArchivedThreads: (channelId, params, options) =>
      fetch({
        method: "GET",
        url: `/channels/${channelId}/users/@me/threads/archived/private`,
        params,
        options,
      }),
    listPrivateArchivedThreads: (channelId, params, options) =>
      fetch({
        method: "GET",
        url: `/channels/${channelId}/threads/archived/private`,
        params,
        options,
      }),
    listPublicArchivedThreads: (channelId, params, options) =>
      fetch({
        method: "GET",
        url: `/channels/${channelId}/threads/archived/public`,
        params,
        options,
      }),
    listScheduledEventsForGuild: (guildId, params, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/scheduled-events`,
        params,
        options,
      }),
    listSkUs: (applicationId, options) =>
      fetch({
        method: "GET",
        url: `/applications/${applicationId}/skus`,
        options,
      }),
    listStickerPacks: options =>
      fetch({
        method: "GET",
        url: `/sticker-packs`,
        options,
      }),
    listThreadMembers: (channelId, params, options) =>
      fetch({
        method: "GET",
        url: `/channels/${channelId}/thread-members`,
        params,
        options,
      }),
    listVoiceRegions: options =>
      fetch({
        method: "GET",
        url: `/voice/regions`,
        options,
      }),
    modifyAutoModerationRule: (
      guildId,
      autoModerationRuleId,
      params,
      options,
    ) =>
      fetch({
        method: "PATCH",
        url: `/guilds/${guildId}/auto-moderation/rules/${autoModerationRuleId}`,
        params,
        options,
      }),
    modifyChannel: (channelId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/channels/${channelId}`,
        params,
        options,
      }),
    modifyCurrentMember: (guildId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/guilds/${guildId}/members/@me`,
        params,
        options,
      }),
    modifyCurrentUser: (params, options) =>
      fetch({
        method: "PATCH",
        url: `/users/@me`,
        params,
        options,
      }),
    modifyCurrentUserNick: (guildId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/guilds/${guildId}/members/@me/nick`,
        params,
        options,
      }),
    modifyCurrentUserVoiceState: (guildId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/guilds/${guildId}/voice-states/@me`,
        params,
        options,
      }),
    modifyGuild: (guildId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/guilds/${guildId}`,
        params,
        options,
      }),
    modifyGuildChannelPositions: (guildId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/guilds/${guildId}/channels`,
        params,
        options,
      }),
    modifyGuildEmoji: (guildId, emojiId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/guilds/${guildId}/emojis/${emojiId}`,
        params,
        options,
      }),
    modifyGuildMember: (guildId, userId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/guilds/${guildId}/members/${userId}`,
        params,
        options,
      }),
    modifyGuildMfaLevel: (guildId, params, options) =>
      fetch({
        method: "POST",
        url: `/guilds/${guildId}/mfa`,
        params,
        options,
      }),
    modifyGuildOnboarding: (guildId, params, options) =>
      fetch({
        method: "PUT",
        url: `/guilds/${guildId}/onboarding`,
        params,
        options,
      }),
    modifyGuildRole: (guildId, roleId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/guilds/${guildId}/roles/${roleId}`,
        params,
        options,
      }),
    modifyGuildRolePositions: (guildId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/guilds/${guildId}/roles`,
        params,
        options,
      }),
    modifyGuildScheduledEvent: (
      guildId,
      guildScheduledEventId,
      params,
      options,
    ) =>
      fetch({
        method: "PATCH",
        url: `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}`,
        params,
        options,
      }),
    modifyGuildSticker: (guildId, stickerId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/guilds/${guildId}/stickers/${stickerId}`,
        params,
        options,
      }),
    modifyGuildTemplate: (guildId, templateCode, params, options) =>
      fetch({
        method: "PATCH",
        url: `/guilds/${guildId}/templates/${templateCode}`,
        params,
        options,
      }),
    modifyGuildWelcomeScreen: (guildId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/guilds/${guildId}/welcome-screen`,
        params,
        options,
      }),
    modifyGuildWidget: (guildId, options) =>
      fetch({
        method: "PATCH",
        url: `/guilds/${guildId}/widget`,
        options,
      }),
    modifyStageInstance: (channelId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/stage-instances/${channelId}`,
        params,
        options,
      }),
    modifyUserVoiceState: (guildId, userId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/guilds/${guildId}/voice-states/${userId}`,
        params,
        options,
      }),
    modifyWebhook: (webhookId, params, options) =>
      fetch({
        method: "PATCH",
        url: `/webhooks/${webhookId}`,
        params,
        options,
      }),
    modifyWebhookWithToken: (webhookId, webhookToken, options) =>
      fetch({
        method: "PATCH",
        url: `/webhooks/${webhookId}/${webhookToken}`,
        options,
      }),
    pinMessage: (channelId, messageId, options) =>
      fetch({
        method: "PUT",
        url: `/channels/${channelId}/pins/${messageId}`,
        options,
      }),
    removeGuildBan: (guildId, userId, options) =>
      fetch({
        method: "DELETE",
        url: `/guilds/${guildId}/bans/${userId}`,
        options,
      }),
    removeGuildMember: (guildId, userId, options) =>
      fetch({
        method: "DELETE",
        url: `/guilds/${guildId}/members/${userId}`,
        options,
      }),
    removeGuildMemberRole: (guildId, userId, roleId, options) =>
      fetch({
        method: "DELETE",
        url: `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
        options,
      }),
    removeThreadMember: (channelId, userId, options) =>
      fetch({
        method: "DELETE",
        url: `/channels/${channelId}/thread-members/${userId}`,
        options,
      }),
    searchGuildMembers: (guildId, params, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/members/search`,
        params,
        options,
      }),
    startThreadFromMessage: (channelId, messageId, params, options) =>
      fetch({
        method: "POST",
        url: `/channels/${channelId}/messages/${messageId}/threads`,
        params,
        options,
      }),
    startThreadInForumOrMediaChannel: (channelId, params, options) =>
      fetch({
        method: "POST",
        url: `/channels/${channelId}/threads`,
        params,
        options,
      }),
    startThreadWithoutMessage: (channelId, params, options) =>
      fetch({
        method: "POST",
        url: `/channels/${channelId}/threads`,
        params,
        options,
      }),
    syncGuildTemplate: (guildId, templateCode, options) =>
      fetch({
        method: "PUT",
        url: `/guilds/${guildId}/templates/${templateCode}`,
        options,
      }),
    triggerTypingIndicator: (channelId, options) =>
      fetch({
        method: "POST",
        url: `/channels/${channelId}/typing`,
        options,
      }),
    unpinMessage: (channelId, messageId, options) =>
      fetch({
        method: "DELETE",
        url: `/channels/${channelId}/pins/${messageId}`,
        options,
      }),
    updateApplicationRoleConnectionMetadataRecords: (applicationId, options) =>
      fetch({
        method: "PUT",
        url: `/applications/${applicationId}/role-connections/metadata`,
        options,
      }),
    updateCurrentUserApplicationRoleConnection: (
      applicationId,
      params,
      options,
    ) =>
      fetch({
        method: "PUT",
        url: `/users/@me/applications/${applicationId}/role-connection`,
        params,
        options,
      }),
  }
}
export interface CreateStageInstanceParams {
  /** The id of the Stage channel */
  readonly channel_id: Snowflake
  /** The topic of the Stage instance (1-120 characters) */
  readonly topic: string
  /** The privacy level of the Stage instance (default GUILD_ONLY) */
  readonly privacy_level?: PrivacyLevel
  /** Notify @everyone that a Stage instance has started */
  readonly send_start_notification?: boolean
  /** The guild scheduled event associated with this Stage instance */
  readonly guild_scheduled_event_id?: Snowflake
}
export interface CreateWebhookParams {
  /** name of the webhook (1-80 characters) */
  readonly name: string
  /** image for the default webhook avatar */
  readonly avatar?: string | null
}
export enum DefaultMessageNotificationLevel {
  /** members will receive notifications for all messages by default */
  ALL_MESSAGES = 0,
  /** members will receive notifications only for messages that @mention them by default */
  ONLY_MENTIONS = 1,
}
export interface DefaultReaction {
  /** the id of a guild's custom emoji */
  readonly emoji_id?: Snowflake | null
  /** the unicode character of the emoji */
  readonly emoji_name?: string | null
}
export interface DeleteWebhookMessageParams {
  /** id of the thread the message is in */
  readonly thread_id: Snowflake
}
export interface EditApplicationCommandPermissionParams {
  /** Permissions for the command in the guild */
  readonly permissions: Array<ApplicationCommandPermission>
}
export interface EditChannelPermissionParams {
  /** the bitwise value of all allowed permissions (default "0") */
  readonly allow?: string
  /** the bitwise value of all disallowed permissions (default "0") */
  readonly deny?: string
  /** 0 for a role or 1 for a member */
  readonly type: number
}
export interface EditCurrentApplicationParams {
  /** Default custom authorization URL for the app, if enabled */
  readonly custom_install_url: string
  /** Description of the app */
  readonly description: string
  /** Role connection verification URL for the app */
  readonly role_connections_verification_url: string
  /** Settings for the app's default in-app authorization link, if enabled */
  readonly install_params: InstallParam
  /** App's public flags */
  readonly flags: number
  /** Icon for the app */
  readonly icon?: string | null
  /** Default rich presence invite cover image for the app */
  readonly cover_image?: string | null
  /** Interactions endpoint URL for the app */
  readonly interactions_endpoint_url: string
  /** List of tags describing the content and functionality of the app (max of 20 characters per tag). Max of 5 tags. */
  readonly tags: Array<string>
}
export interface EditGlobalApplicationCommandParams {
  /** Name of command, 1-32 characters */
  readonly name?: string
  /** Localization dictionary for the name field. Values follow the same restrictions as name */
  readonly name_localizations?: Locale | null
  /** 1-100 character description */
  readonly description?: string
  /** Localization dictionary for the description field. Values follow the same restrictions as description */
  readonly description_localizations?: Locale | null
  /** the parameters for the command */
  readonly options?: Array<ApplicationCommandOption>
  /** Set of permissions represented as a bit set */
  readonly default_member_permissions?: string | null
  /** Indicates whether the command is available in DMs with the app, only for globally-scoped commands. By default, commands are visible. */
  readonly dm_permission?: boolean | null
  /** Replaced by default_member_permissions and will be deprecated in the future. Indicates whether the command is enabled by default when the app is added to a guild. Defaults to true */
  readonly default_permission?: boolean
  /** Indicates whether the command is age-restricted */
  readonly nsfw?: boolean
}
export interface EditGuildApplicationCommandParams {
  /** Name of command, 1-32 characters */
  readonly name?: string
  /** Localization dictionary for the name field. Values follow the same restrictions as name */
  readonly name_localizations?: Locale | null
  /** 1-100 character description */
  readonly description?: string
  /** Localization dictionary for the description field. Values follow the same restrictions as description */
  readonly description_localizations?: Locale | null
  /** Parameters for the command */
  readonly options?: Array<ApplicationCommandOption>
  /** Set of permissions represented as a bit set */
  readonly default_member_permissions?: string | null
  /** Replaced by default_member_permissions and will be deprecated in the future. Indicates whether the command is enabled by default when the app is added to a guild. Defaults to true */
  readonly default_permission?: boolean
  /** Indicates whether the command is age-restricted */
  readonly nsfw?: boolean
}
export interface EditMessageParams {
  /** Message contents (up to 2000 characters) */
  readonly content: string
  /** Up to 10 rich embeds (up to 6000 characters) */
  readonly embeds: Array<Embed>
  /** Edit the flags of a message (only SUPPRESS_EMBEDS can currently be set/unset) */
  readonly flags: number
  /** Allowed mentions for the message */
  readonly allowed_mentions: AllowedMention
  /** Components to include with the message */
  readonly components: Array<Component>
  /** Contents of the file being sent/edited. See Uploading Files */
  readonly files: string
  /** JSON-encoded body of non-file params (multipart/form-data only). See Uploading Files */
  readonly payload_json: string
  /** Attached files to keep and possible descriptions for new files. See Uploading Files */
  readonly attachments: Array<Attachment>
}
export interface EditWebhookMessageParams {
  /** the message contents (up to 2000 characters) */
  readonly content: string
  /** embedded rich content */
  readonly embeds: Array<Embed>
  /** allowed mentions for the message */
  readonly allowed_mentions: AllowedMention
  /** the components to include with the message */
  readonly components: Array<Component>
  /** the contents of the file being sent/edited */
  readonly files: string
  /** JSON encoded body of non-file params (multipart/form-data only) */
  readonly payload_json: string
  /** attached files to keep and possible descriptions for new files */
  readonly attachments: Array<Attachment>
}
export interface Embed {
  /** title of embed */
  readonly title?: string
  /** type of embed (always "rich" for webhook embeds) */
  readonly type?: EmbedType
  /** description of embed */
  readonly description?: string
  /** url of embed */
  readonly url?: string
  /** timestamp of embed content */
  readonly timestamp?: string
  /** color code of the embed */
  readonly color?: number
  /** footer information */
  readonly footer?: EmbedFooter
  /** image information */
  readonly image?: EmbedImage
  /** thumbnail information */
  readonly thumbnail?: EmbedThumbnail
  /** video information */
  readonly video?: EmbedVideo
  /** provider information */
  readonly provider?: EmbedProvider
  /** author information */
  readonly author?: EmbedAuthor
  /** fields information */
  readonly fields?: Array<EmbedField>
}
export interface EmbedAuthor {
  /** name of author */
  readonly name: string
  /** url of author (only supports http(s)) */
  readonly url?: string
  /** url of author icon (only supports http(s) and attachments) */
  readonly icon_url?: string
  /** a proxied url of author icon */
  readonly proxy_icon_url?: string
}
export interface EmbedField {
  /** name of the field */
  readonly name: string
  /** value of the field */
  readonly value: string
  /** whether or not this field should display inline */
  readonly inline?: boolean
}
export interface EmbedFooter {
  /** footer text */
  readonly text: string
  /** url of footer icon (only supports http(s) and attachments) */
  readonly icon_url?: string
  /** a proxied url of footer icon */
  readonly proxy_icon_url?: string
}
export interface EmbedImage {
  /** source url of image (only supports http(s) and attachments) */
  readonly url: string
  /** a proxied url of the image */
  readonly proxy_url?: string
  /** height of image */
  readonly height?: number
  /** width of image */
  readonly width?: number
}
export interface EmbedProvider {
  /** name of provider */
  readonly name?: string
  /** url of provider */
  readonly url?: string
}
export interface EmbedThumbnail {
  /** source url of thumbnail (only supports http(s) and attachments) */
  readonly url: string
  /** a proxied url of the thumbnail */
  readonly proxy_url?: string
  /** height of thumbnail */
  readonly height?: number
  /** width of thumbnail */
  readonly width?: number
}
export enum EmbedType {
  /** generic embed rendered from embed attributes */
  RICH = "rich",
  /** image embed */
  IMAGE = "image",
  /** video embed */
  VIDEO = "video",
  /** animated gif image embed rendered as a video embed */
  GIFV = "gifv",
  /** article embed */
  ARTICLE = "article",
  /** link embed */
  LINK = "link",
}
export interface EmbedVideo {
  /** source url of video */
  readonly url?: string
  /** a proxied url of the video */
  readonly proxy_url?: string
  /** height of video */
  readonly height?: number
  /** width of video */
  readonly width?: number
}
export interface Emoji {
  /** emoji id */
  readonly id?: Snowflake | null
  /** emoji name */
  readonly name?: string | null
  /** roles allowed to use this emoji */
  readonly roles?: Array<Snowflake>
  /** user that created this emoji */
  readonly user?: User
  /** whether this emoji must be wrapped in colons */
  readonly require_colons?: boolean
  /** whether this emoji is managed */
  readonly managed?: boolean
  /** whether this emoji is animated */
  readonly animated?: boolean
  /** whether this emoji can be used, may be false due to loss of Server Boosts */
  readonly available?: boolean
}
export interface Endpoints<O> {
  /** Adds a user to the guild, provided you have a valid oauth2 access token for the user with the guilds.join scope. Returns a 201 Created with the guild member as the body, or 204 No Content if the user is already a member of the guild. Fires a Guild Member Add Gateway event. */
  addGuildMember: (
    guildId: string,
    userId: string,
    params?: Partial<AddGuildMemberParams>,
    options?: O,
  ) => RestResponse<GuildMember>
  /** Adds a role to a guild member. Requires the MANAGE_ROLES permission. Returns a 204 empty response on success. Fires a Guild Member Update Gateway event. */
  addGuildMemberRole: (
    guildId: string,
    userId: string,
    roleId: string,
    options?: O,
  ) => RestResponse<any>
  /** Adds another member to a thread. Requires the ability to send messages in the thread. Also requires the thread is not archived. Returns a 204 empty response if the member is successfully added or was already a member of the thread. Fires a Thread Members Update Gateway event. */
  addThreadMember: (
    channelId: string,
    userId: string,
    options?: O,
  ) => RestResponse<any>
  batchEditApplicationCommandPermissions: (
    applicationId: string,
    guildId: string,
    options?: O,
  ) => RestResponse<any>
  /** Begin a prune operation. Requires the KICK_MEMBERS permission. Returns an object with one pruned key indicating the number of members that were removed in the prune operation. For large guilds it's recommended to set the compute_prune_count option to false, forcing pruned to null. Fires multiple Guild Member Remove Gateway events. */
  beginGuildPrune: (
    guildId: string,
    params?: Partial<BeginGuildPruneParams>,
    options?: O,
  ) => RestResponse<any>
  /** Delete multiple messages in a single request. This endpoint can only be used on guild channels and requires the MANAGE_MESSAGES permission. Returns a 204 empty response on success. Fires a Message Delete Bulk Gateway event. */
  bulkDeleteMessages: (
    channelId: string,
    params?: Partial<BulkDeleteMessageParams>,
    options?: O,
  ) => RestResponse<any>
  /** Takes a list of application commands, overwriting the existing global command list for this application. Returns 200 and a list of application command objects. Commands that do not already exist will count toward daily application command create limits. */
  bulkOverwriteGlobalApplicationCommands: (
    applicationId: string,
    options?: O,
  ) => RestResponse<Array<ApplicationCommand>>
  /** Takes a list of application commands, overwriting the existing command list for this application for the targeted guild. Returns 200 and a list of application command objects. */
  bulkOverwriteGuildApplicationCommands: (
    applicationId: string,
    guildId: string,
    params?: Partial<BulkOverwriteGuildApplicationCommandParams>,
    options?: O,
  ) => RestResponse<Array<ApplicationCommand>>
  /** Create a new rule. Returns an auto moderation rule on success. Fires an Auto Moderation Rule Create Gateway event. */
  createAutoModerationRule: (
    guildId: string,
    params?: Partial<CreateAutoModerationRuleParams>,
    options?: O,
  ) => RestResponse<AutoModerationRule>
  /** Create a new invite object for the channel. Only usable for guild channels. Requires the CREATE_INSTANT_INVITE permission. All JSON parameters for this route are optional, however the request body is not. If you are not sending any fields, you still have to send an empty JSON object ({}). Returns an invite object. Fires an Invite Create Gateway event. */
  createChannelInvite: (
    channelId: string,
    params?: Partial<CreateChannelInviteParams>,
    options?: O,
  ) => RestResponse<Invite>
  /** Create a new DM channel with a user. Returns a DM channel object (if one already exists, it will be returned instead). */
  createDm: (
    params?: Partial<CreateDmParams>,
    options?: O,
  ) => RestResponse<Channel>
  /** Create a followup message for an Interaction. Functions the same as Execute Webhook, but wait is always true. The thread_id, avatar_url, and username parameters are not supported when using this endpoint for interaction followups. */
  createFollowupMessage: (
    applicationId: string,
    interactionToken: string,
    params?: Partial<ExecuteWebhookParams>,
    options?: O,
  ) => RestResponse<any>
  createGlobalApplicationCommand: (
    applicationId: string,
    params?: Partial<CreateGlobalApplicationCommandParams>,
    options?: O,
  ) => RestResponse<ApplicationCommand>
  /** Create a new group DM channel with multiple users. Returns a DM channel object. This endpoint was intended to be used with the now-deprecated GameBridge SDK. Fires a Channel Create Gateway event. */
  createGroupDm: (
    params?: Partial<CreateGroupDmParams>,
    options?: O,
  ) => RestResponse<Channel>
  /** Create a new guild. Returns a guild object on success. Fires a Guild Create Gateway event. */
  createGuild: (
    params?: Partial<CreateGuildParams>,
    options?: O,
  ) => RestResponse<Guild>
  createGuildApplicationCommand: (
    applicationId: string,
    guildId: string,
    params?: Partial<CreateGuildApplicationCommandParams>,
    options?: O,
  ) => RestResponse<ApplicationCommand>
  /** Create a guild ban, and optionally delete previous messages sent by the banned user. Requires the BAN_MEMBERS permission. Returns a 204 empty response on success. Fires a Guild Ban Add Gateway event. */
  createGuildBan: (
    guildId: string,
    userId: string,
    params?: Partial<CreateGuildBanParams>,
    options?: O,
  ) => RestResponse<any>
  /** Create a new channel object for the guild. Requires the MANAGE_CHANNELS permission. If setting permission overwrites, only permissions your bot has in the guild can be allowed/denied. Setting MANAGE_ROLES permission in channels is only possible for guild administrators. Returns the new channel object on success. Fires a Channel Create Gateway event. */
  createGuildChannel: (
    guildId: string,
    params?: Partial<CreateGuildChannelParams>,
    options?: O,
  ) => RestResponse<Channel>
  /** Create a new emoji for the guild. Requires the CREATE_GUILD_EXPRESSIONS permission. Returns the new emoji object on success. Fires a Guild Emojis Update Gateway event. */
  createGuildEmoji: (
    guildId: string,
    params?: Partial<CreateGuildEmojiParams>,
    options?: O,
  ) => RestResponse<Emoji>
  /** Create a new guild based on a template. Returns a guild object on success. Fires a Guild Create Gateway event. */
  createGuildFromGuildTemplate: (
    templateCode: string,
    params?: Partial<CreateGuildFromGuildTemplateParams>,
    options?: O,
  ) => RestResponse<Guild>
  /** Create a new role for the guild. Requires the MANAGE_ROLES permission. Returns the new role object on success. Fires a Guild Role Create Gateway event. All JSON params are optional. */
  createGuildRole: (
    guildId: string,
    params?: Partial<CreateGuildRoleParams>,
    options?: O,
  ) => RestResponse<Role>
  /** Create a guild scheduled event in the guild. Returns a guild scheduled event object on success. Fires a Guild Scheduled Event Create Gateway event. */
  createGuildScheduledEvent: (
    guildId: string,
    params?: Partial<CreateGuildScheduledEventParams>,
    options?: O,
  ) => RestResponse<GuildScheduledEvent>
  /** Create a new sticker for the guild. Send a multipart/form-data body. Requires the CREATE_GUILD_EXPRESSIONS permission. Returns the new sticker object on success. Fires a Guild Stickers Update Gateway event. */
  createGuildSticker: (
    guildId: string,
    params?: Partial<CreateGuildStickerParams>,
    options?: O,
  ) => RestResponse<Sticker>
  /** Creates a template for the guild. Requires the MANAGE_GUILD permission. Returns the created guild template object on success. */
  createGuildTemplate: (
    guildId: string,
    params?: Partial<CreateGuildTemplateParams>,
    options?: O,
  ) => RestResponse<GuildTemplate>
  /** Create a response to an Interaction from the gateway. Body is an interaction response. Returns 204 No Content. */
  createInteractionResponse: (
    interactionId: string,
    interactionToken: string,
    params?: Partial<InteractionResponse>,
    options?: O,
  ) => RestResponse<InteractionResponse>
  createMessage: (
    channelId: string,
    params?: Partial<CreateMessageParams>,
    options?: O,
  ) => RestResponse<Message>
  /** Create a reaction for the message. This endpoint requires the READ_MESSAGE_HISTORY permission to be present on the current user. Additionally, if nobody else has reacted to the message using this emoji, this endpoint requires the ADD_REACTIONS permission to be present on the current user. Returns a 204 empty response on success. Fires a Message Reaction Add Gateway event.
The emoji must be URL Encoded or the request will fail with 10014: Unknown Emoji. To use custom emoji, you must encode it in the format name:id with the emoji name and emoji id. */
  createReaction: (
    channelId: string,
    messageId: string,
    emoji: string,
    options?: O,
  ) => RestResponse<any>
  /** Creates a new Stage instance associated to a Stage channel. Returns that Stage instance. Fires a Stage Instance Create Gateway event. */
  createStageInstance: (
    params?: Partial<CreateStageInstanceParams>,
    options?: O,
  ) => RestResponse<StageInstance>
  /** Creates a test entitlement to a given SKU for a given guild or user. Discord will act as though that user or guild has entitlement to your premium offering. */
  createTestEntitlement: (
    applicationId: string,
    options?: O,
  ) => RestResponse<any>
  /** Creates a new webhook and returns a webhook object on success. Requires the MANAGE_WEBHOOKS permission. Fires a Webhooks Update Gateway event. */
  createWebhook: (
    channelId: string,
    params?: Partial<CreateWebhookParams>,
    options?: O,
  ) => RestResponse<Webhook>
  /** Crosspost a message in an Announcement Channel to following channels. This endpoint requires the SEND_MESSAGES permission, if the current user sent the message, or additionally the MANAGE_MESSAGES permission, for all other messages, to be present for the current user. */
  crosspostMessage: (
    channelId: string,
    messageId: string,
    options?: O,
  ) => RestResponse<Message>
  /** Deletes all reactions on a message. This endpoint requires the MANAGE_MESSAGES permission to be present on the current user. Fires a Message Reaction Remove All Gateway event. */
  deleteAllReactions: (
    channelId: string,
    messageId: string,
    options?: O,
  ) => RestResponse<any>
  /** Deletes all the reactions for a given emoji on a message. This endpoint requires the MANAGE_MESSAGES permission to be present on the current user. Fires a Message Reaction Remove Emoji Gateway event.
The emoji must be URL Encoded or the request will fail with 10014: Unknown Emoji. To use custom emoji, you must encode it in the format name:id with the emoji name and emoji id. */
  deleteAllReactionsForEmoji: (
    channelId: string,
    messageId: string,
    emoji: string,
    options?: O,
  ) => RestResponse<any>
  /** Delete a rule. Returns a 204 on success. Fires an Auto Moderation Rule Delete Gateway event. */
  deleteAutoModerationRule: (
    guildId: string,
    autoModerationRuleId: string,
    options?: O,
  ) => RestResponse<any>
  /** Delete a channel permission overwrite for a user or role in a channel. Only usable for guild channels. Requires the MANAGE_ROLES permission. Returns a 204 empty response on success. Fires a Channel Update Gateway event. For more information about permissions, see permissions */
  deleteChannelPermission: (
    channelId: string,
    overwriteId: string,
    options?: O,
  ) => RestResponse<any>
  /** Delete a channel, or close a private message. Requires the MANAGE_CHANNELS permission for the guild, or MANAGE_THREADS if the channel is a thread. Deleting a category does not delete its child channels; they will have their parent_id removed and a Channel Update Gateway event will fire for each of them. Returns a channel object on success. Fires a Channel Delete Gateway event (or Thread Delete if the channel was a thread). */
  deletecloseChannel: (channelId: string, options?: O) => RestResponse<Channel>
  /** Deletes a followup message for an Interaction. Returns 204 No Content on success. */
  deleteFollowupMessage: (
    applicationId: string,
    interactionToken: string,
    messageId: string,
    options?: O,
  ) => RestResponse<any>
  /** Deletes a global command. Returns 204 No Content on success. */
  deleteGlobalApplicationCommand: (
    applicationId: string,
    commandId: string,
    options?: O,
  ) => RestResponse<any>
  /** Delete a guild permanently. User must be owner. Returns 204 No Content on success. Fires a Guild Delete Gateway event. */
  deleteGuild: (guildId: string, options?: O) => RestResponse<any>
  /** Delete a guild command. Returns 204 No Content on success. */
  deleteGuildApplicationCommand: (
    applicationId: string,
    guildId: string,
    commandId: string,
    options?: O,
  ) => RestResponse<any>
  /** Delete the given emoji. For emojis created by the current user, requires either the CREATE_GUILD_EXPRESSIONS or MANAGE_GUILD_EXPRESSIONS permission. For other emojis, requires the MANAGE_GUILD_EXPRESSIONS permission. Returns 204 No Content on success. Fires a Guild Emojis Update Gateway event. */
  deleteGuildEmoji: (
    guildId: string,
    emojiId: string,
    options?: O,
  ) => RestResponse<any>
  /** Delete the attached integration object for the guild. Deletes any associated webhooks and kicks the associated bot if there is one. Requires the MANAGE_GUILD permission. Returns a 204 empty response on success. Fires Guild Integrations Update and Integration Delete Gateway events. */
  deleteGuildIntegration: (
    guildId: string,
    integrationId: string,
    options?: O,
  ) => RestResponse<any>
  /** Delete a guild role. Requires the MANAGE_ROLES permission. Returns a 204 empty response on success. Fires a Guild Role Delete Gateway event. */
  deleteGuildRole: (
    guildId: string,
    roleId: string,
    options?: O,
  ) => RestResponse<any>
  /** Delete a guild scheduled event. Returns a 204 on success. Fires a Guild Scheduled Event Delete Gateway event. */
  deleteGuildScheduledEvent: (
    guildId: string,
    guildScheduledEventId: string,
    options?: O,
  ) => RestResponse<any>
  /** Delete the given sticker. For stickers created by the current user, requires either the CREATE_GUILD_EXPRESSIONS or MANAGE_GUILD_EXPRESSIONS permission. For other stickers, requires the MANAGE_GUILD_EXPRESSIONS permission. Returns 204 No Content on success. Fires a Guild Stickers Update Gateway event. */
  deleteGuildSticker: (
    guildId: string,
    stickerId: string,
    options?: O,
  ) => RestResponse<any>
  /** Deletes the template. Requires the MANAGE_GUILD permission. Returns the deleted guild template object on success. */
  deleteGuildTemplate: (
    guildId: string,
    templateCode: string,
    options?: O,
  ) => RestResponse<GuildTemplate>
  /** Delete an invite. Requires the MANAGE_CHANNELS permission on the channel this invite belongs to, or MANAGE_GUILD to remove any invite across the guild. Returns an invite object on success. Fires an Invite Delete Gateway event. */
  deleteInvite: (inviteCode: string, options?: O) => RestResponse<Invite>
  /** Delete a message. If operating on a guild channel and trying to delete a message that was not sent by the current user, this endpoint requires the MANAGE_MESSAGES permission. Returns a 204 empty response on success. Fires a Message Delete Gateway event. */
  deleteMessage: (
    channelId: string,
    messageId: string,
    options?: O,
  ) => RestResponse<any>
  /** Deletes the initial Interaction response. Returns 204 No Content on success. */
  deleteOriginalInteractionResponse: (
    applicationId: string,
    interactionToken: string,
    options?: O,
  ) => RestResponse<any>
  /** Delete a reaction the current user has made for the message. Returns a 204 empty response on success. Fires a Message Reaction Remove Gateway event.
The emoji must be URL Encoded or the request will fail with 10014: Unknown Emoji. To use custom emoji, you must encode it in the format name:id with the emoji name and emoji id. */
  deleteOwnReaction: (
    channelId: string,
    messageId: string,
    emoji: string,
    options?: O,
  ) => RestResponse<any>
  /** Deletes the Stage instance. Returns 204 No Content. Fires a Stage Instance Delete Gateway event. */
  deleteStageInstance: (channelId: string, options?: O) => RestResponse<any>
  /** Deletes a currently-active test entitlement. Discord will act as though that user or guild no longer has entitlement to your premium offering. */
  deleteTestEntitlement: (
    applicationId: string,
    entitlementId: string,
    options?: O,
  ) => RestResponse<any>
  /** Deletes another user's reaction. This endpoint requires the MANAGE_MESSAGES permission to be present on the current user. Returns a 204 empty response on success. Fires a Message Reaction Remove Gateway event.
The emoji must be URL Encoded or the request will fail with 10014: Unknown Emoji. To use custom emoji, you must encode it in the format name:id with the emoji name and emoji id. */
  deleteUserReaction: (
    channelId: string,
    messageId: string,
    emoji: string,
    userId: string,
    options?: O,
  ) => RestResponse<any>
  /** Delete a webhook permanently. Requires the MANAGE_WEBHOOKS permission. Returns a 204 No Content response on success. Fires a Webhooks Update Gateway event. */
  deleteWebhook: (webhookId: string, options?: O) => RestResponse<any>
  /** Deletes a message that was created by the webhook. Returns a 204 No Content response on success. */
  deleteWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    messageId: string,
    params?: Partial<DeleteWebhookMessageParams>,
    options?: O,
  ) => RestResponse<any>
  /** Same as above, except this call does not require authentication. */
  deleteWebhookWithToken: (
    webhookId: string,
    webhookToken: string,
    options?: O,
  ) => RestResponse<any>
  editApplicationCommandPermissions: (
    applicationId: string,
    guildId: string,
    commandId: string,
    params?: Partial<EditApplicationCommandPermissionParams>,
    options?: O,
  ) => RestResponse<GuildApplicationCommandPermission>
  /** Edit the channel permission overwrites for a user or role in a channel. Only usable for guild channels. Requires the MANAGE_ROLES permission. Only permissions your bot has in the guild or parent channel (if applicable) can be allowed/denied (unless your bot has a MANAGE_ROLES overwrite in the channel). Returns a 204 empty response on success. Fires a Channel Update Gateway event. For more information about permissions, see permissions. */
  editChannelPermissions: (
    channelId: string,
    overwriteId: string,
    params?: Partial<EditChannelPermissionParams>,
    options?: O,
  ) => RestResponse<any>
  /** Edit properties of the app associated with the requesting bot user. Only properties that are passed will be updated. Returns the updated application object on success. */
  editCurrentApplication: (
    params?: Partial<EditCurrentApplicationParams>,
    options?: O,
  ) => RestResponse<Application>
  /** Edits a followup message for an Interaction. Functions the same as Edit Webhook Message. */
  editFollowupMessage: (
    applicationId: string,
    interactionToken: string,
    messageId: string,
    params?: Partial<EditWebhookMessageParams>,
    options?: O,
  ) => RestResponse<Message>
  editGlobalApplicationCommand: (
    applicationId: string,
    commandId: string,
    params?: Partial<EditGlobalApplicationCommandParams>,
    options?: O,
  ) => RestResponse<ApplicationCommand>
  editGuildApplicationCommand: (
    applicationId: string,
    guildId: string,
    commandId: string,
    params?: Partial<EditGuildApplicationCommandParams>,
    options?: O,
  ) => RestResponse<ApplicationCommand>
  /** Edit a previously sent message. The fields content, embeds, and flags can be edited by the original message author. Other users can only edit flags and only if they have the MANAGE_MESSAGES permission in the corresponding channel. When specifying flags, ensure to include all previously set flags/bits in addition to ones that you are modifying. Only flags documented in the table below may be modified by users (unsupported flag changes are currently ignored without error). */
  editMessage: (
    channelId: string,
    messageId: string,
    params?: Partial<EditMessageParams>,
    options?: O,
  ) => RestResponse<Message>
  /** Edits the initial Interaction response. Functions the same as Edit Webhook Message. */
  editOriginalInteractionResponse: (
    applicationId: string,
    interactionToken: string,
    params?: Partial<EditWebhookMessageParams>,
    options?: O,
  ) => RestResponse<Message>
  /** Edits a previously-sent webhook message from the same token. Returns a message object on success. */
  editWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    messageId: string,
    params?: Partial<EditWebhookMessageParams>,
    options?: O,
  ) => RestResponse<Message>
  /** Add a new webhook to your GitHub repo (in the repo's settings), and use this endpoint as the "Payload URL." You can choose what events your Discord channel receives by choosing the "Let me select individual events" option and selecting individual events for the new webhook you're configuring. */
  executeGitHubCompatibleWebhook: (
    webhookId: string,
    webhookToken: string,
    options?: O,
  ) => RestResponse<any>
  /** Refer to Slack's documentation for more information. We do not support Slack's channel, icon_emoji, mrkdwn, or mrkdwn_in properties. */
  executeSlackCompatibleWebhook: (
    webhookId: string,
    webhookToken: string,
    options?: O,
  ) => RestResponse<any>
  /** Refer to Uploading Files for details on attachments and multipart/form-data requests. Returns a message or 204 No Content depending on the wait query parameter. */
  executeWebhook: (
    webhookId: string,
    webhookToken: string,
    params?: Partial<ExecuteWebhookParams>,
    options?: O,
  ) => RestResponse<any>
  /** Follow an Announcement Channel to send messages to a target channel. Requires the MANAGE_WEBHOOKS permission in the target channel. Returns a followed channel object. Fires a Webhooks Update Gateway event for the target channel. */
  followAnnouncementChannel: (
    channelId: string,
    params?: Partial<FollowAnnouncementChannelParams>,
    options?: O,
  ) => RestResponse<FollowedChannel>
  /** Fetches permissions for a specific command for your application in a guild. Returns a guild application command permissions object. */
  getApplicationCommandPermissions: (
    applicationId: string,
    guildId: string,
    commandId: string,
    options?: O,
  ) => RestResponse<GuildApplicationCommandPermission>
  /** Returns a list of application role connection metadata objects for the given application. */
  getApplicationRoleConnectionMetadataRecords: (
    applicationId: string,
    options?: O,
  ) => RestResponse<Array<ApplicationRoleConnectionMetadatum>>
  /** Get a single rule. Returns an auto moderation rule object. */
  getAutoModerationRule: (
    guildId: string,
    autoModerationRuleId: string,
    options?: O,
  ) => RestResponse<AutoModerationRule>
  /** Get a channel by ID. Returns a channel object.  If the channel is a thread, a thread member object is included in the returned result. */
  getChannel: (channelId: string, options?: O) => RestResponse<Channel>
  /** Returns a list of invite objects (with invite metadata) for the channel. Only usable for guild channels. Requires the MANAGE_CHANNELS permission. */
  getChannelInvites: (
    channelId: string,
    options?: O,
  ) => RestResponse<Array<Invite>>
  /** Retrieves a specific message in the channel. Returns a message object on success. */
  getChannelMessage: (
    channelId: string,
    messageId: string,
    options?: O,
  ) => RestResponse<Message>
  /** Retrieves the messages in a channel. Returns an array of message objects on success. */
  getChannelMessages: (
    channelId: string,
    params?: Partial<GetChannelMessageParams>,
    options?: O,
  ) => RestResponse<Array<Message>>
  /** Returns a list of channel webhook objects. Requires the MANAGE_WEBHOOKS permission. */
  getChannelWebhooks: (
    channelId: string,
    options?: O,
  ) => RestResponse<Array<Webhook>>
  /** Returns the application object associated with the requesting bot user. */
  getCurrentApplication: (options?: O) => RestResponse<Application>
  /** Returns info about the current authorization. Requires authentication with a bearer token. */
  getCurrentAuthorizationInformation: (
    options?: O,
  ) => RestResponse<GetCurrentAuthorizationInformationResponse>
  /** Returns the bot's application object. */
  getCurrentBotApplicationInformation: (
    options?: O,
  ) => RestResponse<Application>
  /** Returns the user object of the requester's account. For OAuth2, this requires the identify scope, which will return the object without an email, and optionally the email scope, which returns the object with an email. */
  getCurrentUser: (options?: O) => RestResponse<User>
  /** Returns the application role connection for the user. Requires an OAuth2 access token with role_connections.write scope for the application specified in the path. */
  getCurrentUserApplicationRoleConnection: (
    applicationId: string,
    options?: O,
  ) => RestResponse<ApplicationRoleConnection>
  /** Returns a list of connection objects. Requires the connections OAuth2 scope. */
  getCurrentUserConnections: (options?: O) => RestResponse<Array<Connection>>
  /** Returns a guild member object for the current user. Requires the guilds.members.read OAuth2 scope. */
  getCurrentUserGuildMember: (
    guildId: string,
    options?: O,
  ) => RestResponse<GuildMember>
  /** Returns a list of partial guild objects the current user is a member of. For OAuth2, requires the guilds scope. */
  getCurrentUserGuilds: (
    params?: Partial<GetCurrentUserGuildParams>,
    options?: O,
  ) => RestResponse<Array<Guild>>
  /** Returns a followup message for an Interaction. Functions the same as Get Webhook Message. */
  getFollowupMessage: (
    applicationId: string,
    interactionToken: string,
    messageId: string,
    params?: Partial<GetWebhookMessageParams>,
    options?: O,
  ) => RestResponse<Message>
  getGateway: (options?: O) => RestResponse<any>
  getGatewayBot: (options?: O) => RestResponse<GetGatewayBotResponse>
  /** Fetch a global command for your application. Returns an application command object. */
  getGlobalApplicationCommand: (
    applicationId: string,
    commandId: string,
    options?: O,
  ) => RestResponse<ApplicationCommand>
  getGlobalApplicationCommands: (
    applicationId: string,
    params?: Partial<GetGlobalApplicationCommandParams>,
    options?: O,
  ) => RestResponse<Array<ApplicationCommand>>
  /** Returns the guild object for the given id. If with_counts is set to true, this endpoint will also return approximate_member_count and approximate_presence_count for the guild. */
  getGuild: (
    guildId: string,
    params?: Partial<GetGuildParams>,
    options?: O,
  ) => RestResponse<Guild>
  /** Fetch a guild command for your application. Returns an application command object. */
  getGuildApplicationCommand: (
    applicationId: string,
    guildId: string,
    commandId: string,
    options?: O,
  ) => RestResponse<ApplicationCommand>
  /** Fetches permissions for all commands for your application in a guild. Returns an array of guild application command permissions objects. */
  getGuildApplicationCommandPermissions: (
    applicationId: string,
    guildId: string,
    options?: O,
  ) => RestResponse<Array<GuildApplicationCommandPermission>>
  getGuildApplicationCommands: (
    applicationId: string,
    guildId: string,
    params?: Partial<GetGuildApplicationCommandParams>,
    options?: O,
  ) => RestResponse<Array<ApplicationCommand>>
  /** Returns an audit log object for the guild. Requires the VIEW_AUDIT_LOG permission. */
  getGuildAuditLog: (
    guildId: string,
    params?: Partial<GetGuildAuditLogParams>,
    options?: O,
  ) => RestResponse<AuditLog>
  /** Returns a ban object for the given user or a 404 not found if the ban cannot be found. Requires the BAN_MEMBERS permission. */
  getGuildBan: (
    guildId: string,
    userId: string,
    options?: O,
  ) => RestResponse<Ban>
  /** Returns a list of ban objects for the users banned from this guild. Requires the BAN_MEMBERS permission. */
  getGuildBans: (
    guildId: string,
    params?: Partial<GetGuildBanParams>,
    options?: O,
  ) => RestResponse<Array<Ban>>
  /** Returns a list of guild channel objects. Does not include threads. */
  getGuildChannels: (
    guildId: string,
    options?: O,
  ) => RestResponse<Array<Channel>>
  /** Returns an emoji object for the given guild and emoji IDs. Includes the user field if the bot has the MANAGE_GUILD_EXPRESSIONS permission, or if the bot created the emoji and has the the CREATE_GUILD_EXPRESSIONS permission. */
  getGuildEmoji: (
    guildId: string,
    emojiId: string,
    options?: O,
  ) => RestResponse<Emoji>
  /** Returns a list of integration objects for the guild. Requires the MANAGE_GUILD permission. */
  getGuildIntegrations: (
    guildId: string,
    options?: O,
  ) => RestResponse<Array<Integration>>
  /** Returns a list of invite objects (with invite metadata) for the guild. Requires the MANAGE_GUILD permission. */
  getGuildInvites: (guildId: string, options?: O) => RestResponse<Array<Invite>>
  /** Returns a guild member object for the specified user. */
  getGuildMember: (
    guildId: string,
    userId: string,
    options?: O,
  ) => RestResponse<GuildMember>
  /** Returns the Onboarding object for the guild. */
  getGuildOnboarding: (
    guildId: string,
    options?: O,
  ) => RestResponse<GuildOnboarding>
  /** Returns the guild preview object for the given id.
If the user is not in the guild, then the guild must be discoverable. */
  getGuildPreview: (guildId: string, options?: O) => RestResponse<GuildPreview>
  /** Returns an object with one pruned key indicating the number of members that would be removed in a prune operation. Requires the KICK_MEMBERS permission. */
  getGuildPruneCount: (
    guildId: string,
    params?: Partial<GetGuildPruneCountParams>,
    options?: O,
  ) => RestResponse<any>
  /** Returns a list of role objects for the guild. */
  getGuildRoles: (guildId: string, options?: O) => RestResponse<Array<Role>>
  /** Get a guild scheduled event. Returns a guild scheduled event object on success. */
  getGuildScheduledEvent: (
    guildId: string,
    guildScheduledEventId: string,
    params?: Partial<GetGuildScheduledEventParams>,
    options?: O,
  ) => RestResponse<GuildScheduledEvent>
  /** Get a list of guild scheduled event users subscribed to a guild scheduled event. Returns a list of guild scheduled event user objects on success. Guild member data, if it exists, is included if the with_member query parameter is set. */
  getGuildScheduledEventUsers: (
    guildId: string,
    guildScheduledEventId: string,
    params?: Partial<GetGuildScheduledEventUserParams>,
    options?: O,
  ) => RestResponse<Array<GuildScheduledEventUser>>
  /** Returns a sticker object for the given guild and sticker IDs. Includes the user field if the bot has the CREATE_GUILD_EXPRESSIONS or MANAGE_GUILD_EXPRESSIONS permission. */
  getGuildSticker: (
    guildId: string,
    stickerId: string,
    options?: O,
  ) => RestResponse<Sticker>
  /** Returns a guild template object for the given code. */
  getGuildTemplate: (
    templateCode: string,
    options?: O,
  ) => RestResponse<GuildTemplate>
  /** Returns an array of guild template objects. Requires the MANAGE_GUILD permission. */
  getGuildTemplates: (
    guildId: string,
    options?: O,
  ) => RestResponse<Array<GuildTemplate>>
  /** Returns a partial invite object for guilds with that feature enabled. Requires the MANAGE_GUILD permission. code will be null if a vanity url for the guild is not set. */
  getGuildVanityUrl: (guildId: string, options?: O) => RestResponse<Invite>
  /** Returns a list of voice region objects for the guild. Unlike the similar /voice route, this returns VIP servers when the guild is VIP-enabled. */
  getGuildVoiceRegions: (
    guildId: string,
    options?: O,
  ) => RestResponse<Array<VoiceRegion>>
  /** Returns a list of guild webhook objects. Requires the MANAGE_WEBHOOKS permission. */
  getGuildWebhooks: (
    guildId: string,
    options?: O,
  ) => RestResponse<Array<Webhook>>
  /** Returns the Welcome Screen object for the guild. If the welcome screen is not enabled, the MANAGE_GUILD permission is required. */
  getGuildWelcomeScreen: (
    guildId: string,
    options?: O,
  ) => RestResponse<WelcomeScreen>
  /** Returns the widget for the guild. Fires an Invite Create Gateway event when an invite channel is defined and a new Invite is generated. */
  getGuildWidget: (guildId: string, options?: O) => RestResponse<GuildWidget>
  /** Returns a PNG image widget for the guild. Requires no permissions or authentication. */
  getGuildWidgetImage: (
    guildId: string,
    params?: Partial<GetGuildWidgetImageParams>,
    options?: O,
  ) => RestResponse<any>
  /** Returns a guild widget settings object. Requires the MANAGE_GUILD permission. */
  getGuildWidgetSettings: (
    guildId: string,
    options?: O,
  ) => RestResponse<GuildWidgetSetting>
  /** Returns an invite object for the given code. */
  getInvite: (
    inviteCode: string,
    params?: Partial<GetInviteParams>,
    options?: O,
  ) => RestResponse<Invite>
  /** Returns the initial Interaction response. Functions the same as Get Webhook Message. */
  getOriginalInteractionResponse: (
    applicationId: string,
    interactionToken: string,
    params?: Partial<GetWebhookMessageParams>,
    options?: O,
  ) => RestResponse<Message>
  /** Returns all pinned messages in the channel as an array of message objects. */
  getPinnedMessages: (
    channelId: string,
    options?: O,
  ) => RestResponse<Array<Message>>
  /** Get a list of users that reacted with this emoji. Returns an array of user objects on success.
The emoji must be URL Encoded or the request will fail with 10014: Unknown Emoji. To use custom emoji, you must encode it in the format name:id with the emoji name and emoji id. */
  getReactions: (
    channelId: string,
    messageId: string,
    emoji: string,
    params?: Partial<GetReactionParams>,
    options?: O,
  ) => RestResponse<Array<User>>
  /** Gets the stage instance associated with the Stage channel, if it exists. */
  getStageInstance: (channelId: string, options?: O) => RestResponse<any>
  /** Returns a sticker object for the given sticker ID. */
  getSticker: (stickerId: string, options?: O) => RestResponse<Sticker>
  /** Returns a thread member object for the specified user if they are a member of the thread, returns a 404 response otherwise. */
  getThreadMember: (
    channelId: string,
    userId: string,
    params?: Partial<GetThreadMemberParams>,
    options?: O,
  ) => RestResponse<ThreadMember>
  /** Returns a user object for a given user ID. */
  getUser: (userId: string, options?: O) => RestResponse<User>
  /** Returns the new webhook object for the given id. */
  getWebhook: (webhookId: string, options?: O) => RestResponse<Webhook>
  /** Returns a previously-sent webhook message from the same token. Returns a message object on success. */
  getWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    messageId: string,
    params?: Partial<GetWebhookMessageParams>,
    options?: O,
  ) => RestResponse<Message>
  /** Same as above, except this call does not require authentication and returns no user in the webhook object. */
  getWebhookWithToken: (
    webhookId: string,
    webhookToken: string,
    options?: O,
  ) => RestResponse<any>
  /** Adds a recipient to a Group DM using their access token. */
  groupDmAddRecipient: (
    channelId: string,
    userId: string,
    params?: Partial<GroupDmAddRecipientParams>,
    options?: O,
  ) => RestResponse<any>
  /** Removes a recipient from a Group DM. */
  groupDmRemoveRecipient: (
    channelId: string,
    userId: string,
    options?: O,
  ) => RestResponse<any>
  /** Adds the current user to a thread. Also requires the thread is not archived. Returns a 204 empty response on success. Fires a Thread Members Update and a Thread Create Gateway event. */
  joinThread: (channelId: string, options?: O) => RestResponse<any>
  /** Leave a guild. Returns a 204 empty response on success. Fires a Guild Delete Gateway event and a Guild Member Remove Gateway event. */
  leaveGuild: (guildId: string, options?: O) => RestResponse<any>
  /** Removes the current user from a thread. Also requires the thread is not archived. Returns a 204 empty response on success. Fires a Thread Members Update Gateway event. */
  leaveThread: (channelId: string, options?: O) => RestResponse<any>
  /** Returns all active threads in the guild, including public and private threads. Threads are ordered by their id, in descending order. */
  listActiveGuildThreads: (
    guildId: string,
    options?: O,
  ) => RestResponse<ListActiveGuildThreadResponse>
  /** Get a list of all rules currently configured for the guild. Returns a list of auto moderation rule objects for the given guild. */
  listAutoModerationRulesForGuild: (
    guildId: string,
    options?: O,
  ) => RestResponse<Array<AutoModerationRule>>
  /** Returns all entitlements for a given app, active and expired. */
  listEntitlements: (applicationId: string, options?: O) => RestResponse<any>
  /** Returns a list of emoji objects for the given guild. Includes user fields if the bot has the CREATE_GUILD_EXPRESSIONS or MANAGE_GUILD_EXPRESSIONS permission. */
  listGuildEmojis: (guildId: string, options?: O) => RestResponse<Array<Emoji>>
  /** Returns a list of guild member objects that are members of the guild. */
  listGuildMembers: (
    guildId: string,
    params?: Partial<ListGuildMemberParams>,
    options?: O,
  ) => RestResponse<Array<GuildMember>>
  /** Returns an array of sticker objects for the given guild. Includes user fields if the bot has the CREATE_GUILD_EXPRESSIONS or MANAGE_GUILD_EXPRESSIONS permission. */
  listGuildStickers: (
    guildId: string,
    options?: O,
  ) => RestResponse<Array<Sticker>>
  /** Returns archived threads in the channel that are of type PRIVATE_THREAD, and the user has joined. Threads are ordered by their id, in descending order. Requires the READ_MESSAGE_HISTORY permission. */
  listJoinedPrivateArchivedThreads: (
    channelId: string,
    params?: Partial<ListJoinedPrivateArchivedThreadParams>,
    options?: O,
  ) => RestResponse<ListJoinedPrivateArchivedThreadResponse>
  /** Returns archived threads in the channel that are of type PRIVATE_THREAD. Threads are ordered by archive_timestamp, in descending order. Requires both the READ_MESSAGE_HISTORY and MANAGE_THREADS permissions. */
  listPrivateArchivedThreads: (
    channelId: string,
    params?: Partial<ListPrivateArchivedThreadParams>,
    options?: O,
  ) => RestResponse<ListPrivateArchivedThreadResponse>
  /** Returns archived threads in the channel that are public. When called on a GUILD_TEXT channel, returns threads of type PUBLIC_THREAD. When called on a GUILD_ANNOUNCEMENT channel returns threads of type ANNOUNCEMENT_THREAD. Threads are ordered by archive_timestamp, in descending order. Requires the READ_MESSAGE_HISTORY permission. */
  listPublicArchivedThreads: (
    channelId: string,
    params?: Partial<ListPublicArchivedThreadParams>,
    options?: O,
  ) => RestResponse<ListPublicArchivedThreadResponse>
  /** Returns a list of guild scheduled event objects for the given guild. */
  listScheduledEventsForGuild: (
    guildId: string,
    params?: Partial<ListScheduledEventsForGuildParams>,
    options?: O,
  ) => RestResponse<Array<GuildScheduledEvent>>
  /** Returns all SKUs for a given application. Because of how our SKU and subscription systems work, you will see two SKUs for your premium offering. For integration and testing entitlements, you should use the SKU with type: 5. */
  listSkUs: (applicationId: string, options?: O) => RestResponse<any>
  /** Returns a list of available sticker packs. */
  listStickerPacks: (options?: O) => RestResponse<any>
  listThreadMembers: (
    channelId: string,
    params?: Partial<ListThreadMemberParams>,
    options?: O,
  ) => RestResponse<Array<ThreadMember>>
  /** Returns an array of voice region objects that can be used when setting a voice or stage channel's rtc_region. */
  listVoiceRegions: (options?: O) => RestResponse<Array<VoiceRegion>>
  /** Modify an existing rule. Returns an auto moderation rule on success. Fires an Auto Moderation Rule Update Gateway event. */
  modifyAutoModerationRule: (
    guildId: string,
    autoModerationRuleId: string,
    params?: Partial<ModifyAutoModerationRuleParams>,
    options?: O,
  ) => RestResponse<AutoModerationRule>
  /** Update a channel's settings. Returns a channel on success, and a 400 BAD REQUEST on invalid parameters. All JSON parameters are optional. */
  modifyChannel: (
    channelId: string,
    params?: Partial<ModifyChannelParams>,
    options?: O,
  ) => RestResponse<Channel>
  /** Modifies the current member in a guild. Returns a 200 with the updated member object on success. Fires a Guild Member Update Gateway event. */
  modifyCurrentMember: (
    guildId: string,
    params?: Partial<ModifyCurrentMemberParams>,
    options?: O,
  ) => RestResponse<any>
  /** Modify the requester's user account settings. Returns a user object on success. Fires a User Update Gateway event. */
  modifyCurrentUser: (
    params?: Partial<ModifyCurrentUserParams>,
    options?: O,
  ) => RestResponse<User>
  modifyCurrentUserNick: (
    guildId: string,
    params?: Partial<ModifyCurrentUserNickParams>,
    options?: O,
  ) => RestResponse<any>
  /** Updates the current user's voice state. Returns 204 No Content on success. Fires a Voice State Update Gateway event. */
  modifyCurrentUserVoiceState: (
    guildId: string,
    params?: Partial<ModifyCurrentUserVoiceStateParams>,
    options?: O,
  ) => RestResponse<any>
  /** Modify a guild's settings. Requires the MANAGE_GUILD permission. Returns the updated guild object on success. Fires a Guild Update Gateway event. */
  modifyGuild: (
    guildId: string,
    params?: Partial<ModifyGuildParams>,
    options?: O,
  ) => RestResponse<Guild>
  /** Modify the positions of a set of channel objects for the guild. Requires MANAGE_CHANNELS permission. Returns a 204 empty response on success. Fires multiple Channel Update Gateway events. */
  modifyGuildChannelPositions: (
    guildId: string,
    params?: Partial<ModifyGuildChannelPositionParams>,
    options?: O,
  ) => RestResponse<any>
  /** Modify the given emoji. For emojis created by the current user, requires either the CREATE_GUILD_EXPRESSIONS or MANAGE_GUILD_EXPRESSIONS permission. For other emojis, requires the MANAGE_GUILD_EXPRESSIONS permission. Returns the updated emoji object on success. Fires a Guild Emojis Update Gateway event. */
  modifyGuildEmoji: (
    guildId: string,
    emojiId: string,
    params?: Partial<ModifyGuildEmojiParams>,
    options?: O,
  ) => RestResponse<Emoji>
  /** Modify attributes of a guild member. Returns a 200 OK with the guild member as the body. Fires a Guild Member Update Gateway event. If the channel_id is set to null, this will force the target user to be disconnected from voice. */
  modifyGuildMember: (
    guildId: string,
    userId: string,
    params?: Partial<ModifyGuildMemberParams>,
    options?: O,
  ) => RestResponse<GuildMember>
  /** Modify a guild's MFA level. Requires guild ownership. Returns the updated level on success. Fires a Guild Update Gateway event. */
  modifyGuildMfaLevel: (
    guildId: string,
    params?: Partial<ModifyGuildMfaLevelParams>,
    options?: O,
  ) => RestResponse<MfaLevel>
  /** Modifies the onboarding configuration of the guild. Returns a 200 with the Onboarding object for the guild. Requires the MANAGE_GUILD and MANAGE_ROLES permissions. */
  modifyGuildOnboarding: (
    guildId: string,
    params?: Partial<ModifyGuildOnboardingParams>,
    options?: O,
  ) => RestResponse<GuildOnboarding>
  /** Modify a guild role. Requires the MANAGE_ROLES permission. Returns the updated role on success. Fires a Guild Role Update Gateway event. */
  modifyGuildRole: (
    guildId: string,
    roleId: string,
    params?: Partial<ModifyGuildRoleParams>,
    options?: O,
  ) => RestResponse<Role>
  /** Modify the positions of a set of role objects for the guild. Requires the MANAGE_ROLES permission. Returns a list of all of the guild's role objects on success. Fires multiple Guild Role Update Gateway events. */
  modifyGuildRolePositions: (
    guildId: string,
    params?: Partial<ModifyGuildRolePositionParams>,
    options?: O,
  ) => RestResponse<Array<Role>>
  /** Modify a guild scheduled event. Returns the modified guild scheduled event object on success. Fires a Guild Scheduled Event Update Gateway event. */
  modifyGuildScheduledEvent: (
    guildId: string,
    guildScheduledEventId: string,
    params?: Partial<ModifyGuildScheduledEventParams>,
    options?: O,
  ) => RestResponse<GuildScheduledEvent>
  /** Modify the given sticker. For stickers created by the current user, requires either the CREATE_GUILD_EXPRESSIONS or MANAGE_GUILD_EXPRESSIONS permission. For other stickers, requires the MANAGE_GUILD_EXPRESSIONS permission. Returns the updated sticker object on success. Fires a Guild Stickers Update Gateway event. */
  modifyGuildSticker: (
    guildId: string,
    stickerId: string,
    params?: Partial<ModifyGuildStickerParams>,
    options?: O,
  ) => RestResponse<Sticker>
  /** Modifies the template's metadata. Requires the MANAGE_GUILD permission. Returns the guild template object on success. */
  modifyGuildTemplate: (
    guildId: string,
    templateCode: string,
    params?: Partial<ModifyGuildTemplateParams>,
    options?: O,
  ) => RestResponse<GuildTemplate>
  /** Modify the guild's Welcome Screen. Requires the MANAGE_GUILD permission. Returns the updated Welcome Screen object. May fire a Guild Update Gateway event. */
  modifyGuildWelcomeScreen: (
    guildId: string,
    params?: Partial<ModifyGuildWelcomeScreenParams>,
    options?: O,
  ) => RestResponse<WelcomeScreen>
  /** Modify a guild widget settings object for the guild. All attributes may be passed in with JSON and modified. Requires the MANAGE_GUILD permission. Returns the updated guild widget settings object. Fires a Guild Update Gateway event. */
  modifyGuildWidget: (
    guildId: string,
    options?: O,
  ) => RestResponse<GuildWidgetSetting>
  /** Updates fields of an existing Stage instance. Returns the updated Stage instance. Fires a Stage Instance Update Gateway event. */
  modifyStageInstance: (
    channelId: string,
    params?: Partial<ModifyStageInstanceParams>,
    options?: O,
  ) => RestResponse<StageInstance>
  /** Updates another user's voice state. Fires a Voice State Update Gateway event. */
  modifyUserVoiceState: (
    guildId: string,
    userId: string,
    params?: Partial<ModifyUserVoiceStateParams>,
    options?: O,
  ) => RestResponse<any>
  /** Modify a webhook. Requires the MANAGE_WEBHOOKS permission. Returns the updated webhook object on success. Fires a Webhooks Update Gateway event. */
  modifyWebhook: (
    webhookId: string,
    params?: Partial<ModifyWebhookParams>,
    options?: O,
  ) => RestResponse<Webhook>
  /** Same as above, except this call does not require authentication, does not accept a channel_id parameter in the body, and does not return a user in the webhook object. */
  modifyWebhookWithToken: (
    webhookId: string,
    webhookToken: string,
    options?: O,
  ) => RestResponse<any>
  /** Pin a message in a channel. Requires the MANAGE_MESSAGES permission. Returns a 204 empty response on success. Fires a Channel Pins Update Gateway event. */
  pinMessage: (
    channelId: string,
    messageId: string,
    options?: O,
  ) => RestResponse<any>
  /** Remove the ban for a user. Requires the BAN_MEMBERS permissions. Returns a 204 empty response on success. Fires a Guild Ban Remove Gateway event. */
  removeGuildBan: (
    guildId: string,
    userId: string,
    options?: O,
  ) => RestResponse<any>
  /** Remove a member from a guild. Requires KICK_MEMBERS permission. Returns a 204 empty response on success. Fires a Guild Member Remove Gateway event. */
  removeGuildMember: (
    guildId: string,
    userId: string,
    options?: O,
  ) => RestResponse<any>
  /** Removes a role from a guild member. Requires the MANAGE_ROLES permission. Returns a 204 empty response on success. Fires a Guild Member Update Gateway event. */
  removeGuildMemberRole: (
    guildId: string,
    userId: string,
    roleId: string,
    options?: O,
  ) => RestResponse<any>
  /** Removes another member from a thread. Requires the MANAGE_THREADS permission, or the creator of the thread if it is a PRIVATE_THREAD. Also requires the thread is not archived. Returns a 204 empty response on success. Fires a Thread Members Update Gateway event. */
  removeThreadMember: (
    channelId: string,
    userId: string,
    options?: O,
  ) => RestResponse<any>
  /** Returns a list of guild member objects whose username or nickname starts with a provided string. */
  searchGuildMembers: (
    guildId: string,
    params?: Partial<SearchGuildMemberParams>,
    options?: O,
  ) => RestResponse<Array<GuildMember>>
  /** Creates a new thread from an existing message. Returns a channel on success, and a 400 BAD REQUEST on invalid parameters. Fires a Thread Create and a Message Update Gateway event. */
  startThreadFromMessage: (
    channelId: string,
    messageId: string,
    params?: Partial<StartThreadFromMessageParams>,
    options?: O,
  ) => RestResponse<Channel>
  /** Creates a new thread in a forum or a media channel, and sends a message within the created thread. Returns a channel, with a nested message object, on success, and a 400 BAD REQUEST on invalid parameters. Fires a Thread Create and Message Create Gateway event. */
  startThreadInForumOrMediaChannel: (
    channelId: string,
    params?: Partial<StartThreadInForumOrMediaChannelParams>,
    options?: O,
  ) => RestResponse<Channel>
  /** Creates a new thread that is not connected to an existing message. Returns a channel on success, and a 400 BAD REQUEST on invalid parameters. Fires a Thread Create Gateway event. */
  startThreadWithoutMessage: (
    channelId: string,
    params?: Partial<StartThreadWithoutMessageParams>,
    options?: O,
  ) => RestResponse<Channel>
  /** Syncs the template to the guild's current state. Requires the MANAGE_GUILD permission. Returns the guild template object on success. */
  syncGuildTemplate: (
    guildId: string,
    templateCode: string,
    options?: O,
  ) => RestResponse<GuildTemplate>
  /** Post a typing indicator for the specified channel, which expires after 10 seconds. Returns a 204 empty response on success. Fires a Typing Start Gateway event. */
  triggerTypingIndicator: (channelId: string, options?: O) => RestResponse<any>
  /** Unpin a message in a channel. Requires the MANAGE_MESSAGES permission. Returns a 204 empty response on success. Fires a Channel Pins Update Gateway event. */
  unpinMessage: (
    channelId: string,
    messageId: string,
    options?: O,
  ) => RestResponse<any>
  /** Updates and returns a list of application role connection metadata objects for the given application. */
  updateApplicationRoleConnectionMetadataRecords: (
    applicationId: string,
    options?: O,
  ) => RestResponse<Array<ApplicationRoleConnectionMetadatum>>
  /** Updates and returns the application role connection for the user. Requires an OAuth2 access token with role_connections.write scope for the application specified in the path. */
  updateCurrentUserApplicationRoleConnection: (
    applicationId: string,
    params?: Partial<UpdateCurrentUserApplicationRoleConnectionParams>,
    options?: O,
  ) => RestResponse<ApplicationRoleConnection>
}
export interface Entitlement {
  /** ID of the entitlement */
  readonly id: Snowflake
  /** ID of the SKU */
  readonly sku_id: Snowflake
  /** ID of the parent application */
  readonly application_id: Snowflake
  /** ID of the user that is granted access to the entitlement's sku */
  readonly user_id?: Snowflake
  /** Type of entitlement */
  readonly type: EntitlementType
  /** Entitlement was deleted */
  readonly deleted: boolean
  /** Start date at which the entitlement is valid. Not present when using test entitlements. */
  readonly starts_at?: string
  /** Date at which the entitlement is no longer valid. Not present when using test entitlements. */
  readonly ends_at?: string
  /** ID of the guild that is granted access to the entitlement's sku */
  readonly guild_id?: Snowflake
}
export type EntitlementCreateEvent = Entitlement
export type EntitlementDeleteEvent = Entitlement
export enum EntitlementType {
  /** Entitlement was purchased as an app subscription */
  APPLICATION_SUBSCRIPTION = 8,
}
export type EntitlementUpdateEvent = Entitlement
export enum EventType {
  /** when a member sends or edits a message in the guild */
  MESSAGE_SEND = 1,
}
export interface ExecuteWebhookParams {
  /** the message contents (up to 2000 characters) */
  readonly content: string
  /** override the default username of the webhook */
  readonly username: string
  /** override the default avatar of the webhook */
  readonly avatar_url: string
  /** true if this is a TTS message */
  readonly tts: boolean
  /** embedded rich content */
  readonly embeds: Array<Embed>
  /** allowed mentions for the message */
  readonly allowed_mentions: AllowedMention
  /** the components to include with the message */
  readonly components: Array<Component>
  /** the contents of the file being sent */
  readonly files: string
  /** JSON encoded body of non-file params */
  readonly payload_json: string
  /** attachment objects with filename and description */
  readonly attachments: Array<Attachment>
  /** message flags combined as a bitfield (only SUPPRESS_EMBEDS can be set) */
  readonly flags: number
  /** name of thread to create (requires the webhook channel to be a forum channel) */
  readonly thread_name: string
}
export enum ExplicitContentFilterLevel {
  /** media content will not be scanned */
  DISABLED = 0,
  /** media content sent by members without roles will be scanned */
  MEMBERS_WITHOUT_ROLES = 1,
  /** media content sent by all members will be scanned */
  ALL_MEMBERS = 2,
}
export interface FollowAnnouncementChannelParams {
  /** id of target channel */
  readonly webhook_channel_id: Snowflake
}
export interface FollowedChannel {
  /** source channel id */
  readonly channel_id: Snowflake
  /** created target webhook id */
  readonly webhook_id: Snowflake
}
export interface ForumAndMediaThreadMessageParam {
  /** Message contents (up to 2000 characters) */
  readonly content?: string
  /** Up to 10 rich embeds (up to 6000 characters) */
  readonly embeds?: Array<Embed>
  /** Allowed mentions for the message */
  readonly allowed_mentions?: AllowedMention
  /** Components to include with the message */
  readonly components?: Array<Component>
  /** IDs of up to 3 stickers in the server to send in the message */
  readonly sticker_ids?: Array<Snowflake>
  /** Attachment objects with filename and description. See Uploading Files */
  readonly attachments?: Array<Attachment>
  /** Message flags combined as a bitfield (only SUPPRESS_EMBEDS and SUPPRESS_NOTIFICATIONS can be set) */
  readonly flags?: number
}
export enum ForumLayoutType {
  /** No default has been set for forum channel */
  NOT_SET = 0,
  /** Display posts as a list */
  LIST_VIEW = 1,
  /** Display posts as a collection of tiles */
  GALLERY_VIEW = 2,
}
export interface ForumTag {
  /** the id of the tag */
  readonly id: Snowflake
  /** the name of the tag (0-20 characters) */
  readonly name: string
  /** whether this tag can only be added to or removed from threads by a member with the MANAGE_THREADS permission */
  readonly moderated: boolean
  /** the id of a guild's custom emoji * */
  readonly emoji_id?: Snowflake | null
  /** the unicode character of the emoji * */
  readonly emoji_name?: string | null
}
export const GatewayIntents = {
  GUILDS: 1 << 0,
  GUILD_MEMBERS: 1 << 1,
  GUILD_MODERATION: 1 << 2,
  GUILD_EMOJIS_AND_STICKERS: 1 << 3,
  GUILD_INTEGRATIONS: 1 << 4,
  GUILD_WEBHOOKS: 1 << 5,
  GUILD_INVITES: 1 << 6,
  GUILD_VOICE_STATES: 1 << 7,
  GUILD_PRESENCES: 1 << 8,
  GUILD_MESSAGES: 1 << 9,
  GUILD_MESSAGE_REACTIONS: 1 << 10,
  GUILD_MESSAGE_TYPING: 1 << 11,
  DIRECT_MESSAGES: 1 << 12,
  DIRECT_MESSAGE_REACTIONS: 1 << 13,
  DIRECT_MESSAGE_TYPING: 1 << 14,
  MESSAGE_CONTENT: 1 << 15,
  GUILD_SCHEDULED_EVENTS: 1 << 16,
  AUTO_MODERATION_CONFIGURATION: 1 << 20,
  AUTO_MODERATION_EXECUTION: 1 << 21,
} as const
export enum GatewayOpcode {
  /** An event was dispatched. */
  DISPATCH = 0,
  /** Fired periodically by the client to keep the connection alive. */
  HEARTBEAT = 1,
  /** Starts a new session during the initial handshake. */
  IDENTIFY = 2,
  /** Update the client's presence. */
  PRESENCE_UPDATE = 3,
  /** Used to join/leave or move between voice channels. */
  VOICE_STATE_UPDATE = 4,
  /** Resume a previous session that was disconnected. */
  RESUME = 6,
  /** You should attempt to reconnect and resume immediately. */
  RECONNECT = 7,
  /** Request information about offline guild members in a large guild. */
  REQUEST_GUILD_MEMBERS = 8,
  /** The session has been invalidated. You should reconnect and identify/resume accordingly. */
  INVALID_SESSION = 9,
  /** Sent immediately after connecting, contains the heartbeat_interval to use. */
  HELLO = 10,
  /** Sent in response to receiving a heartbeat to acknowledge that it has been received. */
  HEARTBEAT_ACK = 11,
}
export interface GatewayPayload<T = any | null> {
  /** opcode for the payload */
  readonly op: GatewayOpcode
  /** event data */
  readonly d?: T
  /** sequence number, used for resuming sessions and heartbeats */
  readonly s?: number | null
  /** the event name for this payload */
  readonly t?: string | null
}
export interface GatewayUrlQueryStringParam {
  /** API Version to use */
  readonly v: number
  /** The encoding of received gateway packets */
  readonly encoding: string
  /** The optional transport compression of gateway packets */
  readonly compress?: string
}
export interface GetChannelMessageParams {
  /** Get messages around this message ID */
  readonly around?: Snowflake
  /** Get messages before this message ID */
  readonly before?: Snowflake
  /** Get messages after this message ID */
  readonly after?: Snowflake
  /** Max number of messages to return (1-100) */
  readonly limit?: number
}
export interface GetCurrentAuthorizationInformationResponse {
  /** the current application */
  readonly application: Application
  /** the scopes the user has authorized the application for */
  readonly scopes: Array<string>
  /** when the access token expires */
  readonly expires: string
  /** the user who has authorized, if the user has authorized with the identify scope */
  readonly user?: User
}
export interface GetCurrentUserGuildParams {
  /** get guilds before this guild ID */
  readonly before: Snowflake
  /** get guilds after this guild ID */
  readonly after: Snowflake
  /** max number of guilds to return (1-200) */
  readonly limit: number
  /** include approximate member and presence counts in response */
  readonly with_counts: boolean
}
export interface GetGatewayBotResponse {
  /** WSS URL that can be used for connecting to the Gateway */
  readonly url: string
  /** Recommended number of shards to use when connecting */
  readonly shards: number
  /** Information on the current session start limit */
  readonly session_start_limit: SessionStartLimit
}
export interface GetGlobalApplicationCommandParams {
  /** Whether to include full localization dictionaries (name_localizations and description_localizations) in the returned objects, instead of the name_localized and description_localized fields. Default false. */
  readonly with_localizations?: boolean
}
export interface GetGuildApplicationCommandParams {
  /** Whether to include full localization dictionaries (name_localizations and description_localizations) in the returned objects, instead of the name_localized and description_localized fields. Default false. */
  readonly with_localizations?: boolean
}
export interface GetGuildAuditLogParams {
  /** Entries from a specific user ID */
  readonly user_id?: Snowflake
  /** Entries for a specific audit log event */
  readonly action_type?: AuditLogEvent
  /** Entries with ID less than a specific audit log entry ID */
  readonly before?: Snowflake
  /** Entries with ID greater than a specific audit log entry ID */
  readonly after?: Snowflake
  /** Maximum number of entries (between 1-100) to return, defaults to 50 */
  readonly limit?: number
}
export interface GetGuildBanParams {
  /** number of users to return (up to maximum 1000) */
  readonly limit?: Number
  /** consider only users before given user id */
  readonly before?: Snowflake
  /** consider only users after given user id */
  readonly after?: Snowflake
}
export interface GetGuildParams {
  /** when true, will return approximate member and presence counts for the guild */
  readonly with_counts?: boolean
}
export interface GetGuildPruneCountParams {
  /** number of days to count prune for (1-30) */
  readonly days: number
  /** role(s) to include */
  readonly include_roles: Array<Snowflake>
}
export interface GetGuildScheduledEventParams {
  /** include number of users subscribed to this event */
  readonly with_user_count?: boolean
}
export interface GetGuildScheduledEventUserParams {
  /** number of users to return (up to maximum 100) */
  readonly limit?: Number
  /** include guild member data if it exists */
  readonly with_member?: boolean
  /** consider only users before given user id */
  readonly before?: Snowflake
  /** consider only users after given user id */
  readonly after?: Snowflake
}
export interface GetGuildWidgetImageParams {
  /** style of the widget image returned (see below) */
  readonly style: string
}
export interface GetInviteParams {
  /** whether the invite should contain approximate member counts */
  readonly with_counts?: boolean
  /** whether the invite should contain the expiration date */
  readonly with_expiration?: boolean
  /** the guild scheduled event to include with the invite */
  readonly guild_scheduled_event_id?: Snowflake
}
export interface GetReactionParams {
  /** Get users after this user ID */
  readonly after?: Snowflake
  /** Max number of users to return (1-100) */
  readonly limit?: number
}
export interface GetThreadMemberParams {
  /** Whether to include a guild member object for the thread member */
  readonly with_member?: boolean
}
export interface GetWebhookMessageParams {
  /** id of the thread the message is in */
  readonly thread_id: Snowflake
}
export interface GroupDmAddRecipientParams {
  /** access token of a user that has granted your app the gdm.join scope */
  readonly access_token: string
  /** nickname of the user being added */
  readonly nick: string
}
export interface Guild {
  /** guild id */
  readonly id: Snowflake
  /** guild name (2-100 characters, excluding trailing and leading whitespace) */
  readonly name: string
  /** icon hash */
  readonly icon?: string | null
  /** icon hash, returned when in the template object */
  readonly icon_hash?: string | null
  /** splash hash */
  readonly splash?: string | null
  /** discovery splash hash; only present for guilds with the "DISCOVERABLE" feature */
  readonly discovery_splash?: string | null
  /** true if the user is the owner of the guild */
  readonly owner?: boolean
  /** id of owner */
  readonly owner_id: Snowflake
  /** total permissions for the user in the guild (excludes overwrites and implicit permissions) */
  readonly permissions?: string
  /** voice region id for the guild (deprecated) */
  readonly region?: string | null
  /** id of afk channel */
  readonly afk_channel_id?: Snowflake | null
  /** afk timeout in seconds */
  readonly afk_timeout: number
  /** true if the server widget is enabled */
  readonly widget_enabled?: boolean
  /** the channel id that the widget will generate an invite to, or null if set to no invite */
  readonly widget_channel_id?: Snowflake | null
  /** verification level required for the guild */
  readonly verification_level: VerificationLevel
  /** default message notifications level */
  readonly default_message_notifications: DefaultMessageNotificationLevel
  /** explicit content filter level */
  readonly explicit_content_filter: ExplicitContentFilterLevel
  /** roles in the guild */
  readonly roles: Array<Role>
  /** custom guild emojis */
  readonly emojis: Array<Emoji>
  /** enabled guild features */
  readonly features: Array<GuildFeature>
  /** required MFA level for the guild */
  readonly mfa_level: MfaLevel
  /** application id of the guild creator if it is bot-created */
  readonly application_id?: Snowflake | null
  /** the id of the channel where guild notices such as welcome messages and boost events are posted */
  readonly system_channel_id?: Snowflake | null
  /** system channel flags */
  readonly system_channel_flags: number
  /** the id of the channel where Community guilds can display rules and/or guidelines */
  readonly rules_channel_id?: Snowflake | null
  /** the maximum number of presences for the guild (null is always returned, apart from the largest of guilds) */
  readonly max_presences?: number | null
  /** the maximum number of members for the guild */
  readonly max_members?: number
  /** the vanity url code for the guild */
  readonly vanity_url_code?: string | null
  /** the description of a guild */
  readonly description?: string | null
  /** banner hash */
  readonly banner?: string | null
  /** premium tier (Server Boost level) */
  readonly premium_tier: PremiumTier
  /** the number of boosts this guild currently has */
  readonly premium_subscription_count?: number
  /** the preferred locale of a Community guild; used in server discovery and notices from Discord, and sent in interactions; defaults to "en-US" */
  readonly preferred_locale: string
  /** the id of the channel where admins and moderators of Community guilds receive notices from Discord */
  readonly public_updates_channel_id?: Snowflake | null
  /** the maximum amount of users in a video channel */
  readonly max_video_channel_users?: number
  /** the maximum amount of users in a stage video channel */
  readonly max_stage_video_channel_users?: number
  /** approximate number of members in this guild, returned from the GET /guilds/<id> and /users/@me/guilds endpoints when with_counts is true */
  readonly approximate_member_count?: number
  /** approximate number of non-offline members in this guild, returned from the GET /guilds/<id> and /users/@me/guilds  endpoints when with_counts is true */
  readonly approximate_presence_count?: number
  /** the welcome screen of a Community guild, shown to new members, returned in an Invite's guild object */
  readonly welcome_screen?: WelcomeScreen
  /** guild NSFW level */
  readonly nsfw_level: GuildNsfwLevel
  /** custom guild stickers */
  readonly stickers?: Array<Sticker>
  /** whether the guild has the boost progress bar enabled */
  readonly premium_progress_bar_enabled: boolean
  /** the id of the channel where admins and moderators of Community guilds receive safety alerts from Discord */
  readonly safety_alerts_channel_id?: Snowflake | null
}
export interface GuildApplicationCommandPermission {
  /** ID of the command or the application ID */
  readonly id: Snowflake
  /** ID of the application the command belongs to */
  readonly application_id: Snowflake
  /** ID of the guild */
  readonly guild_id: Snowflake
  /** Permissions for the command in the guild, max of 100 */
  readonly permissions: Array<ApplicationCommandPermission>
}
export type GuildAuditLogEntryCreateEvent = AuditLogEntry
export interface GuildBanAddEvent {
  /** ID of the guild */
  readonly guild_id: Snowflake
  /** User who was banned */
  readonly user: User
}
export interface GuildBanRemoveEvent {
  /** ID of the guild */
  readonly guild_id: Snowflake
  /** User who was unbanned */
  readonly user: User
}
export type GuildCreateEvent = Guild & GuildCreateExtra
export interface GuildCreateExtra {
  /** When this guild was joined at */
  readonly joined_at: string
  /** true if this is considered a large guild */
  readonly large: boolean
  /** true if this guild is unavailable due to an outage */
  readonly unavailable?: boolean
  /** Total number of members in this guild */
  readonly member_count: number
  /** States of members currently in voice channels; lacks the guild_id key */
  readonly voice_states: Array<VoiceState>
  /** Users in the guild */
  readonly members: Array<GuildMember>
  /** Channels in the guild */
  readonly channels: Array<Channel>
  /** All active threads in the guild that current user has permission to view */
  readonly threads: Array<Channel>
  /** Presences of the members in the guild, will only include non-offline members if the size is greater than large threshold */
  readonly presences: Array<PresenceUpdateEvent>
  /** Stage instances in the guild */
  readonly stage_instances: Array<StageInstance>
  /** Scheduled events in the guild */
  readonly guild_scheduled_events: Array<GuildScheduledEvent>
}
export type GuildDeleteEvent = UnavailableGuild
export interface GuildEmojisUpdateEvent {
  /** ID of the guild */
  readonly guild_id: Snowflake
  /** Array of emojis */
  readonly emojis: Array<Emoji>
}
export enum GuildFeature {
  /** guild has access to set an animated guild banner image */
  ANIMATED_BANNER = "ANIMATED_BANNER",
  /** guild has access to set an animated guild icon */
  ANIMATED_ICON = "ANIMATED_ICON",
  /** guild is using the old permissions configuration behavior */
  APPLICATION_COMMAND_PERMISSIONS_V2 = "APPLICATION_COMMAND_PERMISSIONS_V2",
  /** guild has set up auto moderation rules */
  AUTO_MODERATION = "AUTO_MODERATION",
  /** guild has access to set a guild banner image */
  BANNER = "BANNER",
  /** guild can enable welcome screen, Membership Screening, stage channels and discovery, and receives community updates */
  COMMUNITY = "COMMUNITY",
  /** guild has enabled monetization */
  CREATOR_MONETIZABLE_PROVISIONAL = "CREATOR_MONETIZABLE_PROVISIONAL",
  /** guild has enabled the role subscription promo page */
  CREATOR_STORE_PAGE = "CREATOR_STORE_PAGE",
  /** guild has been set as a support server on the App Directory */
  DEVELOPER_SUPPORT_SERVER = "DEVELOPER_SUPPORT_SERVER",
  /** guild is able to be discovered in the directory */
  DISCOVERABLE = "DISCOVERABLE",
  /** guild is able to be featured in the directory */
  FEATURABLE = "FEATURABLE",
  /** guild has paused invites, preventing new users from joining */
  INVITES_DISABLED = "INVITES_DISABLED",
  /** guild has access to set an invite splash background */
  INVITE_SPLASH = "INVITE_SPLASH",
  /** guild has enabled Membership Screening */
  MEMBER_VERIFICATION_GATE_ENABLED = "MEMBER_VERIFICATION_GATE_ENABLED",
  /** guild has increased custom sticker slots */
  MORE_STICKERS = "MORE_STICKERS",
  /** guild has access to create announcement channels */
  NEWS = "NEWS",
  /** guild is partnered */
  PARTNERED = "PARTNERED",
  /** guild can be previewed before joining via Membership Screening or the directory */
  PREVIEW_ENABLED = "PREVIEW_ENABLED",
  /** guild has disabled alerts for join raids in the configured safety alerts channel */
  RAID_ALERTS_DISABLED = "RAID_ALERTS_DISABLED",
  /** guild is able to set role icons */
  ROLE_ICONS = "ROLE_ICONS",
  /** guild has role subscriptions that can be purchased */
  ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE = "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE",
  /** guild has enabled role subscriptions */
  ROLE_SUBSCRIPTIONS_ENABLED = "ROLE_SUBSCRIPTIONS_ENABLED",
  /** guild has enabled ticketed events */
  TICKETED_EVENTS_ENABLED = "TICKETED_EVENTS_ENABLED",
  /** guild has access to set a vanity URL */
  VANITY_URL = "VANITY_URL",
  /** guild is verified */
  VERIFIED = "VERIFIED",
  /** guild has access to set 384kbps bitrate in voice (previously VIP voice servers) */
  VIP_REGIONS = "VIP_REGIONS",
  /** guild has enabled the welcome screen */
  WELCOME_SCREEN_ENABLED = "WELCOME_SCREEN_ENABLED",
}
export interface GuildIntegrationsUpdateEvent {
  /** ID of the guild whose integrations were updated */
  readonly guild_id: Snowflake
}
export interface GuildMember {
  /** the user this guild member represents */
  readonly user?: User
  /** this user's guild nickname */
  readonly nick?: string | null
  /** the member's guild avatar hash */
  readonly avatar?: string | null
  /** array of role object ids */
  readonly roles: Array<Snowflake>
  /** when the user joined the guild */
  readonly joined_at: string
  /** when the user started boosting the guild */
  readonly premium_since?: string | null
  /** whether the user is deafened in voice channels */
  readonly deaf: boolean
  /** whether the user is muted in voice channels */
  readonly mute: boolean
  /** guild member flags represented as a bit set, defaults to 0 */
  readonly flags: number
  /** whether the user has not yet passed the guild's Membership Screening requirements */
  readonly pending?: boolean
  /** total permissions of the member in the channel, including overwrites, returned when in the interaction object */
  readonly permissions?: string
  /** when the user's timeout will expire and the user will be able to communicate in the guild again, null or a time in the past if the user is not timed out */
  readonly communication_disabled_until?: string | null
}
export type GuildMemberAddEvent = GuildMember & GuildMemberAddExtra
export interface GuildMemberAddExtra {
  /** ID of the guild */
  readonly guild_id: Snowflake
}
export const GuildMemberFlag = {
  /** Member has left and rejoined the guild */
  DID_REJOIN: 1 << 0,
  /** Member has completed onboarding */
  COMPLETED_ONBOARDING: 1 << 1,
  /** Member is exempt from guild verification requirements */
  BYPASSES_VERIFICATION: 1 << 2,
  /** Member has started onboarding */
  STARTED_ONBOARDING: 1 << 3,
} as const
export interface GuildMemberRemoveEvent {
  /** ID of the guild */
  readonly guild_id: Snowflake
  /** User who was removed */
  readonly user: User
}
export interface GuildMembersChunkEvent {
  /** ID of the guild */
  readonly guild_id: Snowflake
  /** Set of guild members */
  readonly members: Array<GuildMember>
  /** Chunk index in the expected chunks for this response (0 <= chunk_index < chunk_count) */
  readonly chunk_index: number
  /** Total number of expected chunks for this response */
  readonly chunk_count: number
  /** When passing an invalid ID to REQUEST_GUILD_MEMBERS, it will be returned here */
  readonly not_found?: Array<any>
  /** When passing true to REQUEST_GUILD_MEMBERS, presences of the returned members will be here */
  readonly presences?: Array<PresenceUpdateEvent>
  /** Nonce used in the Guild Members Request */
  readonly nonce?: string
}
export interface GuildMemberUpdateEvent {
  /** ID of the guild */
  readonly guild_id: Snowflake
  /** User role ids */
  readonly roles: Array<Snowflake>
  /** User */
  readonly user: User
  /** Nickname of the user in the guild */
  readonly nick?: string | null
  /** Member's guild avatar hash */
  readonly avatar?: string | null
  /** When the user joined the guild */
  readonly joined_at?: string | null
  /** When the user starting boosting the guild */
  readonly premium_since?: string | null
  /** Whether the user is deafened in voice channels */
  readonly deaf?: boolean
  /** Whether the user is muted in voice channels */
  readonly mute?: boolean
  /** Whether the user has not yet passed the guild's Membership Screening requirements */
  readonly pending?: boolean
  /** When the user's timeout will expire and the user will be able to communicate in the guild again, null or a time in the past if the user is not timed out */
  readonly communication_disabled_until?: string | null
}
export enum GuildNsfwLevel {
  DEFAULT = 0,
  EXPLICIT = 1,
  SAFE = 2,
  AGE_RESTRICTED = 3,
}
export interface GuildOnboarding {
  /** ID of the guild this onboarding is part of */
  readonly guild_id: Snowflake
  /** Prompts shown during onboarding and in customize community */
  readonly prompts: Array<OnboardingPrompt>
  /** Channel IDs that members get opted into automatically */
  readonly default_channel_ids: Array<Snowflake>
  /** Whether onboarding is enabled in the guild */
  readonly enabled: boolean
  /** Current mode of onboarding */
  readonly mode: OnboardingMode
}
export interface GuildPreview {
  /** guild id */
  readonly id: Snowflake
  /** guild name (2-100 characters) */
  readonly name: string
  /** icon hash */
  readonly icon?: string | null
  /** splash hash */
  readonly splash?: string | null
  /** discovery splash hash */
  readonly discovery_splash?: string | null
  /** custom guild emojis */
  readonly emojis: Array<Emoji>
  /** enabled guild features */
  readonly features: Array<GuildFeature>
  /** approximate number of members in this guild */
  readonly approximate_member_count: number
  /** approximate number of online members in this guild */
  readonly approximate_presence_count: number
  /** the description for the guild */
  readonly description?: string | null
  /** custom guild stickers */
  readonly stickers: Array<Sticker>
}
export interface GuildRoleCreateEvent {
  /** ID of the guild */
  readonly guild_id: Snowflake
  /** Role that was created */
  readonly role: Role
}
export interface GuildRoleDeleteEvent {
  /** ID of the guild */
  readonly guild_id: Snowflake
  /** ID of the role */
  readonly role_id: Snowflake
}
export interface GuildRoleUpdateEvent {
  /** ID of the guild */
  readonly guild_id: Snowflake
  /** Role that was updated */
  readonly role: Role
}
export interface GuildScheduledEvent {
  /** the id of the scheduled event */
  readonly id: Snowflake
  /** the guild id which the scheduled event belongs to */
  readonly guild_id: Snowflake
  /** the channel id in which the scheduled event will be hosted, or null if scheduled entity type is EXTERNAL */
  readonly channel_id?: Snowflake | null
  /** the id of the user that created the scheduled event * */
  readonly creator_id?: Snowflake | null
  /** the name of the scheduled event (1-100 characters) */
  readonly name: string
  /** the description of the scheduled event (1-1000 characters) */
  readonly description?: string | null
  /** the time the scheduled event will start */
  readonly scheduled_start_time: string
  /** the time the scheduled event will end, required if entity_type is EXTERNAL */
  readonly scheduled_end_time?: string | null
  /** the privacy level of the scheduled event */
  readonly privacy_level: GuildScheduledEventPrivacyLevel
  /** the status of the scheduled event */
  readonly status: GuildScheduledEventStatus
  /** the type of the scheduled event */
  readonly entity_type: GuildScheduledEventEntityType
  /** the id of an entity associated with a guild scheduled event */
  readonly entity_id?: Snowflake | null
  /** additional metadata for the guild scheduled event */
  readonly entity_metadata?: GuildScheduledEventEntityMetadatum | null
  /** the user that created the scheduled event */
  readonly creator?: User
  /** the number of users subscribed to the scheduled event */
  readonly user_count?: number
  /** the cover image hash of the scheduled event */
  readonly image?: string | null
}
export type GuildScheduledEventCreateEvent = GuildScheduledEvent
export type GuildScheduledEventDeleteEvent = GuildScheduledEvent
export interface GuildScheduledEventEntityMetadatum {
  /** location of the event (1-100 characters) */
  readonly location?: string
}
export enum GuildScheduledEventEntityType {
  STAGE_INSTANCE = 1,
  VOICE = 2,
  EXTERNAL = 3,
}
export enum GuildScheduledEventPrivacyLevel {
  /** the scheduled event is only accessible to guild members */
  GUILD_ONLY = 2,
}
export enum GuildScheduledEventStatus {
  SCHEDULED = 1,
  ACTIVE = 2,
  COMPLETED = 3,
  CANCELED = 4,
}
export type GuildScheduledEventUpdateEvent = GuildScheduledEvent
export interface GuildScheduledEventUser {
  /** the scheduled event id which the user subscribed to */
  readonly guild_scheduled_event_id: Snowflake
  /** user which subscribed to an event */
  readonly user: User
  /** guild member data for this user for the guild which this event belongs to, if any */
  readonly member?: GuildMember
}
export interface GuildScheduledEventUserAddEvent {
  /** ID of the guild scheduled event */
  readonly guild_scheduled_event_id: Snowflake
  /** ID of the user */
  readonly user_id: Snowflake
  /** ID of the guild */
  readonly guild_id: Snowflake
}
export interface GuildScheduledEventUserRemoveEvent {
  /** ID of the guild scheduled event */
  readonly guild_scheduled_event_id: Snowflake
  /** ID of the user */
  readonly user_id: Snowflake
  /** ID of the guild */
  readonly guild_id: Snowflake
}
export interface GuildStickersUpdateEvent {
  /** ID of the guild */
  readonly guild_id: Snowflake
  /** Array of stickers */
  readonly stickers: Array<Sticker>
}
export interface GuildTemplate {
  /** the template code (unique ID) */
  readonly code: string
  /** template name */
  readonly name: string
  /** the description for the template */
  readonly description?: string | null
  /** number of times this template has been used */
  readonly usage_count: number
  /** the ID of the user who created the template */
  readonly creator_id: Snowflake
  /** the user who created the template */
  readonly creator: User
  /** when this template was created */
  readonly created_at: string
  /** when this template was last synced to the source guild */
  readonly updated_at: string
  /** the ID of the guild this template is based on */
  readonly source_guild_id: Snowflake
  /** the guild snapshot this template contains */
  readonly serialized_source_guild: Guild
  /** whether the template has unsynced changes */
  readonly is_dirty?: boolean | null
}
export type GuildUpdateEvent = Guild
export interface GuildWidget {
  /** guild id */
  readonly id: Snowflake
  /** guild name (2-100 characters) */
  readonly name: string
  /** instant invite for the guilds specified widget invite channel */
  readonly instant_invite?: string | null
  /** voice and stage channels which are accessible by @everyone */
  readonly channels: Array<Channel>
  /** special widget user objects that includes users presence (Limit 100) */
  readonly members: Array<User>
  /** number of online members in this guild */
  readonly presence_count: number
}
export interface GuildWidgetSetting {
  /** whether the widget is enabled */
  readonly enabled: boolean
  /** the widget channel id */
  readonly channel_id?: Snowflake | null
}
export type Heartbeat = number | null
export interface HelloEvent {
  /** Interval (in milliseconds) an app should heartbeat with */
  readonly heartbeat_interval: number
}
export interface Identify {
  /** Authentication token */
  readonly token: string
  /** Connection properties */
  readonly properties: IdentifyConnectionProperty
  /** Whether this connection supports compression of packets */
  readonly compress?: boolean
  /** Value between 50 and 250, total number of members where the gateway will stop sending offline members in the guild member list */
  readonly large_threshold?: number
  /** Used for Guild Sharding */
  readonly shard?: Array<number>
  /** Presence structure for initial presence information */
  readonly presence?: UpdatePresence
  /** Gateway Intents you wish to receive */
  readonly intents: number
}
export interface IdentifyConnectionProperty {
  /** Your operating system */
  readonly os: string
  /** Your library name */
  readonly browser: string
  /** Your library name */
  readonly device: string
}
export interface InstallParam {
  /** Scopes to add the application to the server with */
  readonly scopes: Array<OAuth2Scope>
  /** Permissions to request for the bot role */
  readonly permissions: string
}
export interface Integration {
  /** integration id */
  readonly id: Snowflake
  /** integration name */
  readonly name: string
  /** integration type (twitch, youtube, discord, or guild_subscription) */
  readonly type: string
  /** is this integration enabled */
  readonly enabled: boolean
  /** is this integration syncing */
  readonly syncing?: boolean
  /** id that this integration uses for "subscribers" */
  readonly role_id?: Snowflake
  /** whether emoticons should be synced for this integration (twitch only currently) */
  readonly enable_emoticons?: boolean
  /** the behavior of expiring subscribers */
  readonly expire_behavior?: IntegrationExpireBehavior
  /** the grace period (in days) before expiring subscribers */
  readonly expire_grace_period?: number
  /** user for this integration */
  readonly user?: User
  /** integration account information */
  readonly account: IntegrationAccount
  /** when this integration was last synced */
  readonly synced_at?: string
  /** how many subscribers this integration has */
  readonly subscriber_count?: number
  /** has this integration been revoked */
  readonly revoked?: boolean
  /** The bot/OAuth2 application for discord integrations */
  readonly application?: IntegrationApplication
  /** the scopes the application has been authorized for */
  readonly scopes?: Array<OAuth2Scope>
}
export interface IntegrationAccount {
  /** id of the account */
  readonly id: string
  /** name of the account */
  readonly name: string
}
export interface IntegrationApplication {
  /** the id of the app */
  readonly id: Snowflake
  /** the name of the app */
  readonly name: string
  /** the icon hash of the app */
  readonly icon?: string | null
  /** the description of the app */
  readonly description: string
  /** the bot associated with this application */
  readonly bot?: User
}
export type IntegrationCreateEvent = Integration &
  IntegrationCreateEventAdditional
export interface IntegrationCreateEventAdditional {
  /** ID of the guild */
  readonly guild_id: Snowflake
}
export interface IntegrationDeleteEvent {
  /** Integration ID */
  readonly id: Snowflake
  /** ID of the guild */
  readonly guild_id: Snowflake
  /** ID of the bot/OAuth2 application for this discord integration */
  readonly application_id?: Snowflake
}
export enum IntegrationExpireBehavior {
  REMOVE_ROLE = 0,
  KICK = 1,
}
export type IntegrationUpdateEvent = Integration &
  IntegrationUpdateEventAdditional
export interface IntegrationUpdateEventAdditional {
  /** ID of the guild */
  readonly guild_id: Snowflake
}
export interface Interaction {
  /** ID of the interaction */
  readonly id: Snowflake
  /** ID of the application this interaction is for */
  readonly application_id: Snowflake
  /** Type of interaction */
  readonly type: InteractionType
  /** Interaction data payload */
  readonly data?: InteractionDatum
  /** Guild that the interaction was sent from */
  readonly guild_id?: Snowflake
  /** Channel that the interaction was sent from */
  readonly channel?: Channel
  /** Channel that the interaction was sent from */
  readonly channel_id?: Snowflake
  /** Guild member data for the invoking user, including permissions */
  readonly member?: GuildMember
  /** User object for the invoking user, if invoked in a DM */
  readonly user?: User
  /** Continuation token for responding to the interaction */
  readonly token: string
  /** Read-only property, always 1 */
  readonly version: number
  /** For components, the message they were attached to */
  readonly message?: Message
  /** Bitwise set of permissions the app or bot has within the channel the interaction was sent from */
  readonly app_permissions?: string
  /** Selected language of the invoking user */
  readonly locale?: string
  /** Guild's preferred locale, if invoked in a guild */
  readonly guild_locale?: string
  /** For monetized apps, any entitlements for the invoking user, representing access to premium SKUs */
  readonly entitlements: Array<Entitlement>
}
export interface InteractionCallbackAutocomplete {
  /** autocomplete choices (max of 25 choices) */
  readonly choices: Array<ApplicationCommandOptionChoice>
}
export type InteractionCallbackDatum =
  | InteractionCallbackAutocomplete
  | InteractionCallbackMessage
  | InteractionCallbackModal
export interface InteractionCallbackMessage {
  /** is the response TTS */
  readonly tts?: boolean
  /** message content */
  readonly content?: string
  /** supports up to 10 embeds */
  readonly embeds?: Array<Embed>
  /** allowed mentions object */
  readonly allowed_mentions?: AllowedMention
  /** message flags combined as a bitfield (only SUPPRESS_EMBEDS and EPHEMERAL can be set) */
  readonly flags?: number
  /** message components */
  readonly components?: Array<Component>
  /** attachment objects with filename and description */
  readonly attachments?: Array<Attachment>
}
export interface InteractionCallbackModal {
  /** a developer-defined identifier for the modal, max 100 characters */
  readonly custom_id: string
  /** the title of the popup modal, max 45 characters */
  readonly title: string
  /** between 1 and 5 (inclusive) components that make up the modal */
  readonly components: Array<Component>
}
export enum InteractionCallbackType {
  /** ACK a Ping */
  PONG = 1,
  /** respond to an interaction with a message */
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  /** ACK an interaction and edit a response later, the user sees a loading state */
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
  /** for components, ACK an interaction and edit the original message later; the user does not see a loading state */
  DEFERRED_UPDATE_MESSAGE = 6,
  /** for components, edit the message the component was attached to */
  UPDATE_MESSAGE = 7,
  /** respond to an autocomplete interaction with suggested choices */
  APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8,
  /** respond to an interaction with a popup modal */
  MODAL = 9,
  /** respond to an interaction with an upgrade button, only available for apps with monetization enabled */
  PREMIUM_REQUIRED = 10,
}
export type InteractionCreateEvent = Interaction
export type InteractionDatum =
  | ApplicationCommandDatum
  | MessageComponentDatum
  | ModalSubmitDatum
export interface InteractionResponse {
  /** the type of response */
  readonly type: InteractionCallbackType
  /** an optional response message */
  readonly data?: InteractionCallbackDatum
}
export enum InteractionType {
  PING = 1,
  APPLICATION_COMMAND = 2,
  MESSAGE_COMPONENT = 3,
  APPLICATION_COMMAND_AUTOCOMPLETE = 4,
  MODAL_SUBMIT = 5,
}
export type InvalidSessionEvent = boolean
export interface Invite {
  /** the invite code (unique ID) */
  readonly code: string
  /** the guild this invite is for */
  readonly guild?: Guild
  /** the channel this invite is for */
  readonly channel?: Channel | null
  /** the user who created the invite */
  readonly inviter?: User
  /** the type of target for this voice channel invite */
  readonly target_type?: InviteTargetType
  /** the user whose stream to display for this voice channel stream invite */
  readonly target_user?: User
  /** the embedded application to open for this voice channel embedded application invite */
  readonly target_application?: Application
  /** approximate count of online members, returned from the GET /invites/<code> endpoint when with_counts is true */
  readonly approximate_presence_count?: number
  /** approximate count of total members, returned from the GET /invites/<code> endpoint when with_counts is true */
  readonly approximate_member_count?: number
  /** the expiration date of this invite, returned from the GET /invites/<code> endpoint when with_expiration is true */
  readonly expires_at?: string | null
  /** stage instance data if there is a public Stage instance in the Stage channel this invite is for (deprecated) */
  readonly stage_instance?: InviteStageInstance
  /** guild scheduled event data, only included if guild_scheduled_event_id contains a valid guild scheduled event id */
  readonly guild_scheduled_event?: GuildScheduledEvent
}
export interface InviteCreateEvent {
  /** Channel the invite is for */
  readonly channel_id: Snowflake
  /** Unique invite code */
  readonly code: string
  /** Time at which the invite was created */
  readonly created_at: string
  /** Guild of the invite */
  readonly guild_id?: Snowflake
  /** User that created the invite */
  readonly inviter?: User
  /** How long the invite is valid for (in seconds) */
  readonly max_age: number
  /** Maximum number of times the invite can be used */
  readonly max_uses: number
  /** Type of target for this voice channel invite */
  readonly target_type?: InviteTargetType
  /** User whose stream to display for this voice channel stream invite */
  readonly target_user?: User
  /** Embedded application to open for this voice channel embedded application invite */
  readonly target_application?: Application
  /** Whether or not the invite is temporary (invited users will be kicked on disconnect unless they're assigned a role) */
  readonly temporary: boolean
  /** How many times the invite has been used (always will be 0) */
  readonly uses: number
}
export interface InviteDeleteEvent {
  /** Channel of the invite */
  readonly channel_id: Snowflake
  /** Guild of the invite */
  readonly guild_id?: Snowflake
  /** Unique invite code */
  readonly code: string
}
export interface InviteMetadatum {
  /** number of times this invite has been used */
  readonly uses: number
  /** max number of times this invite can be used */
  readonly max_uses: number
  /** duration (in seconds) after which the invite expires */
  readonly max_age: number
  /** whether this invite only grants temporary membership */
  readonly temporary: boolean
  /** when this invite was created */
  readonly created_at: string
}
export interface InviteStageInstance {
  /** the members speaking in the Stage */
  readonly members: Array<GuildMember>
  /** the number of users in the Stage */
  readonly participant_count: number
  /** the number of users speaking in the Stage */
  readonly speaker_count: number
  /** the topic of the Stage instance (1-120 characters) */
  readonly topic: string
}
export enum InviteTargetType {
  STREAM = 1,
  EMBEDDED_APPLICATION = 2,
}
export enum KeywordPresetType {
  /** words that may be considered forms of swearing or cursing */
  PROFANITY = 1,
  /** words that refer to sexually explicit behavior or activity */
  SEXUAL_CONTENT = 2,
  /** personal insults or words that may be considered hate speech */
  SLURS = 3,
}
export interface ListActiveGuildThreadResponse {
  /** the active threads */
  readonly threads: Array<Channel>
  /** a thread member object for each returned thread the current user has joined */
  readonly members: Array<ThreadMember>
}
export interface ListGuildMemberParams {
  /** max number of members to return (1-1000) */
  readonly limit: number
  /** the highest user id in the previous page */
  readonly after: Snowflake
}
export interface ListJoinedPrivateArchivedThreadParams {
  /** returns threads before this id */
  readonly before?: Snowflake
  /** optional maximum number of threads to return */
  readonly limit?: number
}
export interface ListJoinedPrivateArchivedThreadResponse {
  /** the private, archived threads the current user has joined */
  readonly threads: Array<Channel>
  /** a thread member object for each returned thread the current user has joined */
  readonly members: Array<ThreadMember>
  /** whether there are potentially additional threads that could be returned on a subsequent call */
  readonly has_more: boolean
}
export interface ListPrivateArchivedThreadParams {
  /** returns threads archived before this timestamp */
  readonly before?: string
  /** optional maximum number of threads to return */
  readonly limit?: number
}
export interface ListPrivateArchivedThreadResponse {
  /** the private, archived threads */
  readonly threads: Array<Channel>
  /** a thread member object for each returned thread the current user has joined */
  readonly members: Array<ThreadMember>
  /** whether there are potentially additional threads that could be returned on a subsequent call */
  readonly has_more: boolean
}
export interface ListPublicArchivedThreadParams {
  /** returns threads archived before this timestamp */
  readonly before?: string
  /** optional maximum number of threads to return */
  readonly limit?: number
}
export interface ListPublicArchivedThreadResponse {
  /** the public, archived threads */
  readonly threads: Array<Channel>
  /** a thread member object for each returned thread the current user has joined */
  readonly members: Array<ThreadMember>
  /** whether there are potentially additional threads that could be returned on a subsequent call */
  readonly has_more: boolean
}
export interface ListScheduledEventsForGuildParams {
  /** include number of users subscribed to each event */
  readonly with_user_count?: boolean
}
export interface ListThreadMemberParams {
  /** Whether to include a guild member object for each thread member */
  readonly with_member?: boolean
  /** Get thread members after this user ID */
  readonly after?: Snowflake
  /** Max number of thread members to return (1-100). Defaults to 100. */
  readonly limit?: number
}
export interface Locale {
  /** Danish */
  readonly da?: string
  /** German */
  readonly de?: string
  /** English, */
  readonly "en-GB"?: string
  /** English, */
  readonly "en-US"?: string
  /** Spanish */
  readonly "es-ES"?: string
  /** French */
  readonly fr?: string
  /** Croatian */
  readonly hr?: string
  /** Italian */
  readonly it?: string
  /** Lithuanian */
  readonly lt?: string
  /** Hungarian */
  readonly hu?: string
  /** Dutch */
  readonly nl?: string
  /** Norwegian */
  readonly no?: string
  /** Polish */
  readonly pl?: string
  /** Portuguese, Brazilian */
  readonly "pt-BR"?: string
  /** Romanian, Romania */
  readonly ro?: string
  /** Finnish */
  readonly fi?: string
  /** Swedish */
  readonly "sv-SE"?: string
  /** Vietnamese */
  readonly vi?: string
  /** Turkish */
  readonly tr?: string
  /** Czech */
  readonly cs?: string
  /** Greek */
  readonly el?: string
  /** Bulgarian */
  readonly bg?: string
  /** Russian */
  readonly ru?: string
  /** Ukrainian */
  readonly uk?: string
  /** Hindi */
  readonly hi?: string
  /** Thai */
  readonly th?: string
  /** Chinese, China */
  readonly "zh-CN"?: string
  /** Japanese */
  readonly ja?: string
  /** Chinese, Taiwan */
  readonly "zh-TW"?: string
  /** Korean */
  readonly ko?: string
}
export enum MembershipState {
  INVITED = 1,
  ACCEPTED = 2,
}
export interface Message {
  /** id of the message */
  readonly id: Snowflake
  /** id of the channel the message was sent in */
  readonly channel_id: Snowflake
  /** the author of this message (not guaranteed to be a valid user, see below) */
  readonly author: User
  /** contents of the message */
  readonly content: string
  /** when this message was sent */
  readonly timestamp: string
  /** when this message was edited (or null if never) */
  readonly edited_timestamp?: string | null
  /** whether this was a TTS message */
  readonly tts: boolean
  /** whether this message mentions everyone */
  readonly mention_everyone: boolean
  /** users specifically mentioned in the message */
  readonly mentions: Array<User>
  /** roles specifically mentioned in this message */
  readonly mention_roles: Array<Snowflake>
  /** channels specifically mentioned in this message */
  readonly mention_channels?: Array<ChannelMention>
  /** any attached files */
  readonly attachments: Array<Attachment>
  /** any embedded content */
  readonly embeds: Array<Embed>
  /** reactions to the message */
  readonly reactions?: Array<Reaction>
  /** used for validating a message was sent */
  readonly nonce?: string
  /** whether this message is pinned */
  readonly pinned: boolean
  /** if the message is generated by a webhook, this is the webhook's id */
  readonly webhook_id?: Snowflake
  /** type of message */
  readonly type: MessageType
  /** sent with Rich Presence-related chat embeds */
  readonly activity?: MessageActivity
  /** sent with Rich Presence-related chat embeds */
  readonly application?: Application
  /** if the message is an Interaction or application-owned webhook, this is the id of the application */
  readonly application_id?: Snowflake
  /** data showing the source of a crosspost, channel follow add, pin, or reply message */
  readonly message_reference?: MessageReference
  /** message flags combined as a bitfield */
  readonly flags?: number
  /** the message associated with the message_reference */
  readonly referenced_message?: Message | null
  /** sent if the message is a response to an Interaction */
  readonly interaction?: MessageInteraction
  /** the thread that was started from this message, includes thread member object */
  readonly thread?: Channel
  /** sent if the message contains components like buttons, action rows, or other interactive components */
  readonly components?: Array<Component>
  /** sent if the message contains stickers */
  readonly sticker_items?: Array<StickerItem>
  /** Deprecated the stickers sent with the message */
  readonly stickers?: Array<Sticker>
  /** A generally increasing integer (there may be gaps or duplicates) that represents the approximate position of the message in a thread, it can be used to estimate the relative position of the message in a thread in company with total_message_sent on parent thread */
  readonly position?: number
  /** data of the role subscription purchase or renewal that prompted this ROLE_SUBSCRIPTION_PURCHASE message */
  readonly role_subscription_data?: RoleSubscriptionDatum
  /** data for users, members, channels, and roles in the message's auto-populated select menus */
  readonly resolved?: ResolvedDatum
}
export interface MessageActivity {
  /** type of message activity */
  readonly type: MessageActivityType
  /** party_id from a Rich Presence event */
  readonly party_id?: string
}
export enum MessageActivityType {
  JOIN = 1,
  SPECTATE = 2,
  LISTEN = 3,
  JOIN_REQUEST = 5,
}
export interface MessageComponentDatum {
  /** the custom_id of the component */
  readonly custom_id: string
  /** the type of the component */
  readonly component_type: ComponentType
  /** values the user selected in a select menu component */
  readonly values?: Array<SelectOption>
  /** resolved entities from selected options */
  readonly resolved?: ResolvedDatum
}
export type MessageCreateEvent = Message & MessageCreateExtra
export interface MessageCreateExtra {
  /** ID of the guild the message was sent in - unless it is an ephemeral message */
  readonly guild_id?: Snowflake
  /** Member properties for this message's author. Missing for ephemeral messages and messages from webhooks */
  readonly member?: GuildMember
  /** Users specifically mentioned in the message */
  readonly mentions: Array<User>
}
export interface MessageDeleteBulkEvent {
  /** IDs of the messages */
  readonly ids: Array<Snowflake>
  /** ID of the channel */
  readonly channel_id: Snowflake
  /** ID of the guild */
  readonly guild_id?: Snowflake
}
export interface MessageDeleteEvent {
  /** ID of the message */
  readonly id: Snowflake
  /** ID of the channel */
  readonly channel_id: Snowflake
  /** ID of the guild */
  readonly guild_id?: Snowflake
}
export const MessageFlag = {
  /** this message has been published to subscribed channels (via Channel Following) */
  CROSSPOSTED: 1 << 0,
  /** this message originated from a message in another channel (via Channel Following) */
  IS_CROSSPOST: 1 << 1,
  /** do not include any embeds when serializing this message */
  SUPPRESS_EMBEDS: 1 << 2,
  /** the source message for this crosspost has been deleted (via Channel Following) */
  SOURCE_MESSAGE_DELETED: 1 << 3,
  /** this message came from the urgent message system */
  URGENT: 1 << 4,
  /** this message has an associated thread, with the same id as the message */
  HAS_THREAD: 1 << 5,
  /** this message is only visible to the user who invoked the Interaction */
  EPHEMERAL: 1 << 6,
  /** this message is an Interaction Response and the bot is "thinking" */
  LOADING: 1 << 7,
  /** this message failed to mention some roles and add their members to the thread */
  FAILED_TO_MENTION_SOME_ROLES_IN_THREAD: 1 << 8,
  /** this message will not trigger push and desktop notifications */
  SUPPRESS_NOTIFICATIONS: 1 << 12,
  /** this message is a voice message */
  IS_VOICE_MESSAGE: 1 << 13,
} as const
export interface MessageInteraction {
  /** ID of the interaction */
  readonly id: Snowflake
  /** Type of interaction */
  readonly type: InteractionType
  /** Name of the application command, including subcommands and subcommand groups */
  readonly name: string
  /** User who invoked the interaction */
  readonly user: User
  /** Member who invoked the interaction in the guild */
  readonly member?: GuildMember
}
export interface MessageReactionAddEvent {
  /** ID of the user */
  readonly user_id: Snowflake
  /** ID of the channel */
  readonly channel_id: Snowflake
  /** ID of the message */
  readonly message_id: Snowflake
  /** ID of the guild */
  readonly guild_id?: Snowflake
  /** Member who reacted if this happened in a guild */
  readonly member?: GuildMember
  /** Emoji used to react - example */
  readonly emoji: Emoji
  /** ID of the user who authored the message which was reacted to */
  readonly message_author_id?: Snowflake
}
export interface MessageReactionRemoveAllEvent {
  /** ID of the channel */
  readonly channel_id: Snowflake
  /** ID of the message */
  readonly message_id: Snowflake
  /** ID of the guild */
  readonly guild_id?: Snowflake
}
export interface MessageReactionRemoveEmojiEvent {
  /** ID of the channel */
  readonly channel_id: Snowflake
  /** ID of the guild */
  readonly guild_id?: Snowflake
  /** ID of the message */
  readonly message_id: Snowflake
  /** Emoji that was removed */
  readonly emoji: Emoji
}
export interface MessageReactionRemoveEvent {
  /** ID of the user */
  readonly user_id: Snowflake
  /** ID of the channel */
  readonly channel_id: Snowflake
  /** ID of the message */
  readonly message_id: Snowflake
  /** ID of the guild */
  readonly guild_id?: Snowflake
  /** Emoji used to react - example */
  readonly emoji: Emoji
}
export interface MessageReference {
  /** id of the originating message */
  readonly message_id?: Snowflake
  /** id of the originating message's channel */
  readonly channel_id?: Snowflake
  /** id of the originating message's guild */
  readonly guild_id?: Snowflake
  /** when sending, whether to error if the referenced message doesn't exist instead of sending as a normal (non-reply) message, default true */
  readonly fail_if_not_exists?: boolean
}
export enum MessageType {
  DEFAULT = 0,
  RECIPIENT_ADD = 1,
  RECIPIENT_REMOVE = 2,
  CALL = 3,
  CHANNEL_NAME_CHANGE = 4,
  CHANNEL_ICON_CHANGE = 5,
  CHANNEL_PINNED_MESSAGE = 6,
  USER_JOIN = 7,
  GUILD_BOOST = 8,
  GUILD_BOOST_TIER_1 = 9,
  GUILD_BOOST_TIER_2 = 10,
  GUILD_BOOST_TIER_3 = 11,
  CHANNEL_FOLLOW_ADD = 12,
  GUILD_DISCOVERY_DISQUALIFIED = 14,
  GUILD_DISCOVERY_REQUALIFIED = 15,
  GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
  GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 17,
  THREAD_CREATED = 18,
  REPLY = 19,
  CHAT_INPUT_COMMAND = 20,
  THREAD_STARTER_MESSAGE = 21,
  GUILD_INVITE_REMINDER = 22,
  CONTEXT_MENU_COMMAND = 23,
  AUTO_MODERATION_ACTION = 24,
  ROLE_SUBSCRIPTION_PURCHASE = 25,
  INTERACTION_PREMIUM_UPSELL = 26,
  STAGE_START = 27,
  STAGE_END = 28,
  STAGE_SPEAKER = 29,
  STAGE_TOPIC = 31,
  GUILD_APPLICATION_PREMIUM_SUBSCRIPTION = 32,
}
export type MessageUpdateEvent = MessageCreateEvent
export enum MfaLevel {
  /** guild has no MFA/2FA requirement for moderation actions */
  NONE = 0,
  /** guild has a 2FA requirement for moderation actions */
  ELEVATED = 1,
}
export interface ModalSubmitDatum {
  /** the custom_id of the modal */
  readonly custom_id: string
  /** the values submitted by the user */
  readonly components: Array<Component>
}
export interface ModifyAutoModerationRuleParams {
  /** the rule name */
  readonly name: string
  /** the event type */
  readonly event_type: EventType
  /** the trigger metadata */
  readonly trigger_metadata?: TriggerMetadatum
  /** the actions which will execute when the rule is triggered */
  readonly actions: Array<AutoModerationAction>
  /** whether the rule is enabled */
  readonly enabled: boolean
  /** the role ids that should not be affected by the rule (Maximum of 20) */
  readonly exempt_roles: Array<Snowflake>
  /** the channel ids that should not be affected by the rule (Maximum of 50) */
  readonly exempt_channels: Array<Snowflake>
}
export interface ModifyChannelGroupDmParams {
  /** 1-100 character channel name */
  readonly name: string
  /** base64 encoded icon */
  readonly icon: string
}
export interface ModifyChannelGuildChannelParams {
  /** 1-100 character channel name */
  readonly name: string
  /** the type of channel; only conversion between text and announcement is supported and only in guilds with the "NEWS" feature */
  readonly type: ChannelType
  /** the position of the channel in the left-hand listing */
  readonly position?: number | null
  /** 0-1024 character channel topic (0-4096 characters for GUILD_FORUM and GUILD_MEDIA channels) */
  readonly topic?: string | null
  /** whether the channel is nsfw */
  readonly nsfw?: boolean | null
  /** amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission manage_messages or manage_channel, are unaffected */
  readonly rate_limit_per_user?: number | null
  /** the bitrate (in bits) of the voice or stage channel; min 8000 */
  readonly bitrate?: number | null
  /** the user limit of the voice or stage channel, max 99 for voice channels and 10,000 for stage channels (0 refers to no limit) */
  readonly user_limit?: number | null
  /** channel or category-specific permissions */
  readonly permission_overwrites?: Array<Overwrite> | null
  /** id of the new parent category for a channel */
  readonly parent_id?: Snowflake | null
  /** channel voice region id, automatic when set to null */
  readonly rtc_region?: string | null
  /** the camera video quality mode of the voice channel */
  readonly video_quality_mode?: VideoQualityMode | null
  /** the default duration that the clients use (not the API) for newly created threads in the channel, in minutes, to automatically archive the thread after recent activity */
  readonly default_auto_archive_duration?: number | null
  /** channel flags combined as a bitfield. Currently only REQUIRE_TAG (1 << 4) is supported by GUILD_FORUM and GUILD_MEDIA channels. HIDE_MEDIA_DOWNLOAD_OPTIONS (1 << 15) is supported only by GUILD_MEDIA channels */
  readonly flags?: number
  /** the set of tags that can be used in a GUILD_FORUM or a GUILD_MEDIA channel; limited to 20 */
  readonly available_tags?: Array<ForumTag>
  /** the emoji to show in the add reaction button on a thread in a GUILD_FORUM or a GUILD_MEDIA channel */
  readonly default_reaction_emoji?: DefaultReaction | null
  /** the initial rate_limit_per_user to set on newly created threads in a channel. this field is copied to the thread at creation time and does not live update. */
  readonly default_thread_rate_limit_per_user?: number
  /** the default sort order type used to order posts in GUILD_FORUM and GUILD_MEDIA channels */
  readonly default_sort_order?: SortOrderType | null
  /** the default forum layout type used to display posts in GUILD_FORUM channels */
  readonly default_forum_layout?: ForumLayoutType
}
export type ModifyChannelParams =
  | ModifyChannelGroupDmParams
  | ModifyChannelGuildChannelParams
  | ModifyChannelThreadParams
export interface ModifyChannelThreadParams {
  /** 1-100 character channel name */
  readonly name: string
  /** whether the thread is archived */
  readonly archived: boolean
  /** the thread will stop showing in the channel list after auto_archive_duration minutes of inactivity, can be set to: 60, 1440, 4320, 10080 */
  readonly auto_archive_duration: number
  /** whether the thread is locked; when a thread is locked, only users with MANAGE_THREADS can unarchive it */
  readonly locked: boolean
  /** whether non-moderators can add other non-moderators to a thread; only available on private threads */
  readonly invitable: boolean
  /** amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission manage_messages, manage_thread, or manage_channel, are unaffected */
  readonly rate_limit_per_user?: number | null
  /** channel flags combined as a bitfield; PINNED can only be set for threads in forum and media channels */
  readonly flags?: number
  /** the IDs of the set of tags that have been applied to a thread in a GUILD_FORUM or a GUILD_MEDIA channel; limited to 5 */
  readonly applied_tags?: Array<Snowflake>
}
export interface ModifyCurrentMemberParams {
  /** value to set user's nickname to */
  readonly nick?: string | null
}
export interface ModifyCurrentUserNickParams {
  /** value to set user's nickname to */
  readonly nick?: string | null
}
export interface ModifyCurrentUserParams {
  /** user's username, if changed may cause the user's discriminator to be randomized. */
  readonly username: string
  /** if passed, modifies the user's avatar */
  readonly avatar?: string | null
}
export interface ModifyCurrentUserVoiceStateParams {
  /** the id of the channel the user is currently in */
  readonly channel_id?: Snowflake
  /** toggles the user's suppress state */
  readonly suppress?: boolean
  /** sets the user's request to speak */
  readonly request_to_speak_timestamp?: string | null
}
export interface ModifyGuildChannelPositionParams {
  /** channel id */
  readonly id: Snowflake
  /** sorting position of the channel */
  readonly position?: number | null
  /** syncs the permission overwrites with the new parent, if moving to a new category */
  readonly lock_permissions?: boolean | null
  /** the new parent ID for the channel that is moved */
  readonly parent_id?: Snowflake | null
}
export interface ModifyGuildEmojiParams {
  /** name of the emoji */
  readonly name: string
  /** roles allowed to use this emoji */
  readonly roles?: Array<Snowflake> | null
}
export interface ModifyGuildMemberParams {
  /** value to set user's nickname to */
  readonly nick: string
  /** array of role ids the member is assigned */
  readonly roles: Array<Snowflake>
  /** whether the user is muted in voice channels. Will throw a 400 error if the user is not in a voice channel */
  readonly mute: boolean
  /** whether the user is deafened in voice channels. Will throw a 400 error if the user is not in a voice channel */
  readonly deaf: boolean
  /** id of channel to move user to (if they are connected to voice) */
  readonly channel_id: Snowflake
  /** when the user's timeout will expire and the user will be able to communicate in the guild again (up to 28 days in the future), set to null to remove timeout. Will throw a 403 error if the user has the ADMINISTRATOR permission or is the owner of the guild */
  readonly communication_disabled_until: string
  /** guild member flags */
  readonly flags: number
}
export interface ModifyGuildMfaLevelParams {
  /** MFA level */
  readonly level: MfaLevel
}
export interface ModifyGuildOnboardingParams {
  /** Prompts shown during onboarding and in customize community */
  readonly prompts: Array<OnboardingPrompt>
  /** Channel IDs that members get opted into automatically */
  readonly default_channel_ids: Array<Snowflake>
  /** Whether onboarding is enabled in the guild */
  readonly enabled: boolean
  /** Current mode of onboarding */
  readonly mode: OnboardingMode
}
export interface ModifyGuildParams {
  /** guild name */
  readonly name: string
  /** guild voice region id (deprecated) */
  readonly region?: string | null
  /** verification level */
  readonly verification_level?: VerificationLevel | null
  /** default message notification level */
  readonly default_message_notifications?: DefaultMessageNotificationLevel | null
  /** explicit content filter level */
  readonly explicit_content_filter?: ExplicitContentFilterLevel | null
  /** id for afk channel */
  readonly afk_channel_id?: Snowflake | null
  /** afk timeout in seconds, can be set to: 60, 300, 900, 1800, 3600 */
  readonly afk_timeout: number
  /** base64 1024x1024 png/jpeg/gif image for the guild icon (can be animated gif when the server has the ANIMATED_ICON feature) */
  readonly icon?: string | null
  /** user id to transfer guild ownership to (must be owner) */
  readonly owner_id: Snowflake
  /** base64 16:9 png/jpeg image for the guild splash (when the server has the INVITE_SPLASH feature) */
  readonly splash?: string | null
  /** base64 16:9 png/jpeg image for the guild discovery splash (when the server has the DISCOVERABLE feature) */
  readonly discovery_splash?: string | null
  /** base64 16:9 png/jpeg image for the guild banner (when the server has the BANNER feature; can be animated gif when the server has the ANIMATED_BANNER feature) */
  readonly banner?: string | null
  /** the id of the channel where guild notices such as welcome messages and boost events are posted */
  readonly system_channel_id?: Snowflake | null
  /** system channel flags */
  readonly system_channel_flags: number
  /** the id of the channel where Community guilds display rules and/or guidelines */
  readonly rules_channel_id?: Snowflake | null
  /** the id of the channel where admins and moderators of Community guilds receive notices from Discord */
  readonly public_updates_channel_id?: Snowflake | null
  /** the preferred locale of a Community guild used in server discovery and notices from Discord; defaults to "en-US" */
  readonly preferred_locale?: string | null
  /** enabled guild features */
  readonly features: Array<GuildFeature>
  /** the description for the guild */
  readonly description?: string | null
  /** whether the guild's boost progress bar should be enabled */
  readonly premium_progress_bar_enabled: boolean
  /** the id of the channel where admins and moderators of Community guilds receive safety alerts from Discord */
  readonly safety_alerts_channel_id?: Snowflake | null
}
export interface ModifyGuildRoleParams {
  /** name of the role, max 100 characters */
  readonly name: string
  /** bitwise value of the enabled/disabled permissions */
  readonly permissions: string
  /** RGB color value */
  readonly color: number
  /** whether the role should be displayed separately in the sidebar */
  readonly hoist: boolean
  /** the role's icon image (if the guild has the ROLE_ICONS feature) */
  readonly icon: string
  /** the role's unicode emoji as a standard emoji (if the guild has the ROLE_ICONS feature) */
  readonly unicode_emoji: string
  /** whether the role should be mentionable */
  readonly mentionable: boolean
}
export interface ModifyGuildRolePositionParams {
  /** role */
  readonly id: Snowflake
  /** sorting position of the role */
  readonly position?: number | null
}
export interface ModifyGuildScheduledEventParams {
  /** the channel id of the scheduled event, set to null if changing entity type to EXTERNAL */
  readonly channel_id?: Snowflake | null
  /** the entity metadata of the scheduled event */
  readonly entity_metadata?: GuildScheduledEventEntityMetadatum | null
  /** the name of the scheduled event */
  readonly name?: string
  /** the privacy level of the scheduled event */
  readonly privacy_level?: GuildScheduledEventPrivacyLevel
  /** the time to schedule the scheduled event */
  readonly scheduled_start_time?: string
  /** the time when the scheduled event is scheduled to end */
  readonly scheduled_end_time?: string
  /** the description of the scheduled event */
  readonly description?: string | null
  /** the entity type of the scheduled event */
  readonly entity_type?: GuildScheduledEventEntityType
  /** the status of the scheduled event */
  readonly status?: GuildScheduledEventStatus
  /** the cover image of the scheduled event */
  readonly image?: string
}
export interface ModifyGuildStickerParams {
  /** name of the sticker (2-30 characters) */
  readonly name: string
  /** description of the sticker (2-100 characters) */
  readonly description?: string | null
  /** autocomplete/suggestion tags for the sticker (max 200 characters) */
  readonly tags: string
}
export interface ModifyGuildTemplateParams {
  /** name of the template (1-100 characters) */
  readonly name?: string
  /** description for the template (0-120 characters) */
  readonly description?: string | null
}
export interface ModifyGuildWelcomeScreenParams {
  /** whether the welcome screen is enabled */
  readonly enabled: boolean
  /** channels linked in the welcome screen and their display options */
  readonly welcome_channels: Array<WelcomeScreenChannel>
  /** the server description to show in the welcome screen */
  readonly description: string
}
export interface ModifyStageInstanceParams {
  /** The topic of the Stage instance (1-120 characters) */
  readonly topic?: string
  /** The privacy level of the Stage instance */
  readonly privacy_level?: PrivacyLevel
}
export interface ModifyUserVoiceStateParams {
  /** the id of the channel the user is currently in */
  readonly channel_id: Snowflake
  /** toggles the user's suppress state */
  readonly suppress?: boolean
}
export interface ModifyWebhookParams {
  /** the default name of the webhook */
  readonly name: string
  /** image for the default webhook avatar */
  readonly avatar?: string | null
  /** the new channel id this webhook should be moved to */
  readonly channel_id: Snowflake
}
export enum MutableGuildFeature {
  COMMUNITY = "COMMUNITY",
  DISCOVERABLE = "DISCOVERABLE",
  INVITES_DISABLED = "INVITES_DISABLED",
  RAID_ALERTS_DISABLED = "RAID_ALERTS_DISABLED",
}
export enum OAuth2Scope {
  /** allows your app to fetch data from a user's "Now Playing/Recently Played" list — not currently available for apps */
  ACTIVITIES_READ = "activities.read",
  /** allows your app to update a user's activity - not currently available for apps (NOT REQUIRED FOR GAMESDK ACTIVITY MANAGER) */
  ACTIVITIES_WRITE = "activities.write",
  /** allows your app to read build data for a user's applications */
  APPLICATIONS_BUILDS_READ = "applications.builds.read",
  /** allows your app to upload/update builds for a user's applications - requires Discord approval */
  APPLICATIONS_BUILDS_UPLOAD = "applications.builds.upload",
  /** allows your app to add commands to a guild - included by default with the bot scope */
  APPLICATIONS_COMMANDS = "applications.commands",
  /** allows your app to update its commands using a Bearer token - client credentials grant only */
  APPLICATIONS_COMMANDS_UPDATE = "applications.commands.update",
  /** allows your app to update permissions for its commands in a guild a user has permissions to */
  APPLICATIONS_COMMANDS_PERMISSIONS_UPDATE = "applications.commands.permissions.update",
  /** allows your app to read entitlements for a user's applications */
  APPLICATIONS_ENTITLEMENTS = "applications.entitlements",
  /** allows your app to read and update store data (SKUs, store listings, achievements, etc.) for a user's applications */
  APPLICATIONS_STORE_UPDATE = "applications.store.update",
  /** for oauth2 bots, this puts the bot in the user's selected guild by default */
  BOT = "bot",
  /** allows /users/@me/connections to return linked third-party accounts */
  CONNECTIONS = "connections",
  /** allows your app to see information about the user's DMs and group DMs - requires Discord approval */
  DM_CHANNELS_READ = "dm_channels.read",
  /** enables /users/@me to return an email */
  EMAIL = "email",
  /** allows your app to join users to a group dm */
  GDM_JOIN = "gdm.join",
  /** allows /users/@me/guilds to return basic information about all of a user's guilds */
  GUILDS = "guilds",
  /** allows /guilds/{guild.id}/members/{user.id} to be used for joining users to a guild */
  GUILDS_JOIN = "guilds.join",
  /** allows /users/@me/guilds/{guild.id}/member to return a user's member information in a guild */
  GUILDS_MEMBERS_READ = "guilds.members.read",
  /** allows /users/@me without email */
  IDENTIFY = "identify",
  /** for local rpc server api access, this allows you to read messages from all client channels (otherwise restricted to channels/guilds your app creates) */
  MESSAGES_READ = "messages.read",
  /** allows your app to know a user's friends and implicit relationships - requires Discord approval */
  RELATIONSHIPS_READ = "relationships.read",
  /** allows your app to update a user's connection and metadata for the app */
  ROLE_CONNECTIONS_WRITE = "role_connections.write",
  /** for local rpc server access, this allows you to control a user's local Discord client - requires Discord approval */
  RPC = "rpc",
  /** for local rpc server access, this allows you to update a user's activity - requires Discord approval */
  RPC_ACTIVITIES_WRITE = "rpc.activities.write",
  /** for local rpc server access, this allows you to receive notifications pushed out to the user - requires Discord approval */
  RPC_NOTIFICATIONS_READ = "rpc.notifications.read",
  /** for local rpc server access, this allows you to read a user's voice settings and listen for voice events - requires Discord approval */
  RPC_VOICE_READ = "rpc.voice.read",
  /** for local rpc server access, this allows you to update a user's voice settings - requires Discord approval */
  RPC_VOICE_WRITE = "rpc.voice.write",
  /** allows your app to connect to voice on user's behalf and see all the voice members - requires Discord approval */
  VOICE = "voice",
  /** this generates a webhook that is returned in the oauth token response for authorization code grants */
  WEBHOOK_INCOMING = "webhook.incoming",
}
export enum OnboardingMode {
  /** Counts only Default Channels towards constraints */
  ONBOARDING_DEFAULT = 0,
  /** Counts Default Channels and Questions towards constraints */
  ONBOARDING_ADVANCED = 1,
}
export interface OnboardingPrompt {
  /** ID of the prompt */
  readonly id: Snowflake
  /** Type of prompt */
  readonly type: PromptType
  /** Options available within the prompt */
  readonly options: Array<PromptOption>
  /** Title of the prompt */
  readonly title: string
  /** Indicates whether users are limited to selecting one option for the prompt */
  readonly single_select: boolean
  /** Indicates whether the prompt is required before a user completes the onboarding flow */
  readonly required: boolean
  /** Indicates whether the prompt is present in the onboarding flow. If false, the prompt will only appear in the Channels & Roles tab */
  readonly in_onboarding: boolean
}
export interface Overwrite {
  /** role or user id */
  readonly id: Snowflake
  /** either 0 (role) or 1 (member) */
  readonly type: number
  /** permission bit set */
  readonly allow: string
  /** permission bit set */
  readonly deny: string
}
export const PermissionFlag = {
  /** Allows creation of instant invites */
  CREATE_INSTANT_INVITE: BigInt(1) << BigInt(0),
  /** Allows kicking members */
  KICK_MEMBERS: BigInt(1) << BigInt(1),
  /** Allows banning members */
  BAN_MEMBERS: BigInt(1) << BigInt(2),
  /** Allows all permissions and bypasses channel permission overwrites */
  ADMINISTRATOR: BigInt(1) << BigInt(3),
  /** Allows management and editing of channels */
  MANAGE_CHANNELS: BigInt(1) << BigInt(4),
  /** Allows management and editing of the guild */
  MANAGE_GUILD: BigInt(1) << BigInt(5),
  /** Allows for the addition of reactions to messages */
  ADD_REACTIONS: BigInt(1) << BigInt(6),
  /** Allows for viewing of audit logs */
  VIEW_AUDIT_LOG: BigInt(1) << BigInt(7),
  /** Allows for using priority speaker in a voice channel */
  PRIORITY_SPEAKER: BigInt(1) << BigInt(8),
  /** Allows the user to go live */
  STREAM: BigInt(1) << BigInt(9),
  /** Allows guild members to view a channel, which includes reading messages in text channels and joining voice channels */
  VIEW_CHANNEL: BigInt(1) << BigInt(10),
  /** Allows for sending messages in a channel and creating threads in a forum (does not allow sending messages in threads) */
  SEND_MESSAGES: BigInt(1) << BigInt(11),
  /** Allows for sending of /tts messages */
  SEND_TTS_MESSAGES: BigInt(1) << BigInt(12),
  /** Allows for deletion of other users messages */
  MANAGE_MESSAGES: BigInt(1) << BigInt(13),
  /** Links sent by users with this permission will be auto-embedded */
  EMBED_LINKS: BigInt(1) << BigInt(14),
  /** Allows for uploading images and files */
  ATTACH_FILES: BigInt(1) << BigInt(15),
  /** Allows for reading of message history */
  READ_MESSAGE_HISTORY: BigInt(1) << BigInt(16),
  /** Allows for using the @everyone tag to notify all users in a channel, and the @here tag to notify all online users in a channel */
  MENTION_EVERYONE: BigInt(1) << BigInt(17),
  /** Allows the usage of custom emojis from other servers */
  USE_EXTERNAL_EMOJIS: BigInt(1) << BigInt(18),
  /** Allows for viewing guild insights */
  VIEW_GUILD_INSIGHTS: BigInt(1) << BigInt(19),
  /** Allows for joining of a voice channel */
  CONNECT: BigInt(1) << BigInt(20),
  /** Allows for speaking in a voice channel */
  SPEAK: BigInt(1) << BigInt(21),
  /** Allows for muting members in a voice channel */
  MUTE_MEMBERS: BigInt(1) << BigInt(22),
  /** Allows for deafening of members in a voice channel */
  DEAFEN_MEMBERS: BigInt(1) << BigInt(23),
  /** Allows for moving of members between voice channels */
  MOVE_MEMBERS: BigInt(1) << BigInt(24),
  /** Allows for using voice-activity-detection in a voice channel */
  USE_VAD: BigInt(1) << BigInt(25),
  /** Allows for modification of own nickname */
  CHANGE_NICKNAME: BigInt(1) << BigInt(26),
  /** Allows for modification of other users nicknames */
  MANAGE_NICKNAMES: BigInt(1) << BigInt(27),
  /** Allows management and editing of roles */
  MANAGE_ROLES: BigInt(1) << BigInt(28),
  /** Allows management and editing of webhooks */
  MANAGE_WEBHOOKS: BigInt(1) << BigInt(29),
  /** Allows for editing and deleting emojis, stickers, and soundboard sounds created by all users */
  MANAGE_GUILD_EXPRESSIONS: BigInt(1) << BigInt(30),
  /** Allows members to use application commands, including slash commands and context menu commands. */
  USE_APPLICATION_COMMANDS: BigInt(1) << BigInt(31),
  /** Allows for requesting to speak in stage channels. (This permission is under active development and may be changed or removed.) */
  REQUEST_TO_SPEAK: BigInt(1) << BigInt(32),
  /** Allows for editing and deleting scheduled events created by all users */
  MANAGE_EVENTS: BigInt(1) << BigInt(33),
  /** Allows for deleting and archiving threads, and viewing all private threads */
  MANAGE_THREADS: BigInt(1) << BigInt(34),
  /** Allows for creating public and announcement threads */
  CREATE_PUBLIC_THREADS: BigInt(1) << BigInt(35),
  /** Allows for creating private threads */
  CREATE_PRIVATE_THREADS: BigInt(1) << BigInt(36),
  /** Allows the usage of custom stickers from other servers */
  USE_EXTERNAL_STICKERS: BigInt(1) << BigInt(37),
  /** Allows for sending messages in threads */
  SEND_MESSAGES_IN_THREADS: BigInt(1) << BigInt(38),
  /** Allows for using Activities (applications with the EMBEDDED flag) in a voice channel */
  USE_EMBEDDED_ACTIVITIES: BigInt(1) << BigInt(39),
  /** Allows for timing out users to prevent them from sending or reacting to messages in chat and threads, and from speaking in voice and stage channels */
  MODERATE_MEMBERS: BigInt(1) << BigInt(40),
  /** Allows for viewing role subscription insights */
  VIEW_CREATOR_MONETIZATION_ANALYTICS: BigInt(1) << BigInt(41),
  /** Allows for using soundboard in a voice channel */
  USE_SOUNDBOARD: BigInt(1) << BigInt(42),
  /** Allows for creating emojis, stickers, and soundboard sounds, and editing and deleting those created by the current user */
  CREATE_GUILD_EXPRESSIONS: BigInt(1) << BigInt(43),
  /** Allows for creating scheduled events, and editing and deleting those created by the current user */
  CREATE_EVENTS: BigInt(1) << BigInt(44),
  /** Allows the usage of custom soundboard sounds from other servers */
  USE_EXTERNAL_SOUNDS: BigInt(1) << BigInt(45),
  /** Allows sending voice messages */
  SEND_VOICE_MESSAGES: BigInt(1) << BigInt(46),
} as const
export enum PremiumTier {
  /** guild has not unlocked any Server Boost perks */
  NONE = 0,
  /** guild has unlocked Server Boost level 1 perks */
  TIER_1 = 1,
  /** guild has unlocked Server Boost level 2 perks */
  TIER_2 = 2,
  /** guild has unlocked Server Boost level 3 perks */
  TIER_3 = 3,
}
export enum PremiumType {
  NONE = 0,
  NITRO_CLASSIC = 1,
  NITRO = 2,
  NITRO_BASIC = 3,
}
export interface PresenceUpdateEvent {
  /** User whose presence is being updated */
  readonly user: User
  /** ID of the guild */
  readonly guild_id: Snowflake
  /** Either "idle", "dnd", "online", or "offline" */
  readonly status: string
  /** User's current activities */
  readonly activities: Array<Activity>
  /** User's platform-dependent status */
  readonly client_status: ClientStatus
}
export enum PrivacyLevel {
  /** The Stage instance is visible publicly. (deprecated) */
  PUBLIC = 1,
  /** The Stage instance is visible to only guild members. */
  GUILD_ONLY = 2,
}
export interface PromptOption {
  /** ID of the prompt option */
  readonly id: Snowflake
  /** IDs for channels a member is added to when the option is selected */
  readonly channel_ids: Array<Snowflake>
  /** IDs for roles assigned to a member when the option is selected */
  readonly role_ids: Array<Snowflake>
  /** Emoji of the option (see below) */
  readonly emoji?: Emoji
  /** Emoji ID of the option (see below) */
  readonly emoji_id?: Snowflake
  /** Emoji name of the option (see below) */
  readonly emoji_name?: string
  /** Whether the emoji is animated (see below) */
  readonly emoji_animated?: boolean
  /** Title of the option */
  readonly title: string
  /** Description of the option */
  readonly description?: string | null
}
export enum PromptType {
  MULTIPLE_CHOICE = 0,
  DROPDOWN = 1,
}
export interface Reaction {
  /** Total number of times this emoji has been used to react (including super reacts) */
  readonly count: number
  /** Reaction count details object */
  readonly count_details: ReactionCountDetail
  /** Whether the current user reacted using this emoji */
  readonly me: boolean
  /** Whether the current user super-reacted using this emoji */
  readonly me_burst: boolean
  /** emoji information */
  readonly emoji: Emoji
  /** HEX colors used for super reaction */
  readonly burst_colors: Array<any>
}
export interface ReactionCountDetail {
  /** Count of super reactions */
  readonly burst: number
  /** Count of normal reactions */
  readonly normal: number
}
export interface ReadyEvent {
  /** API version */
  readonly v: number
  /** Information about the user including email */
  readonly user: User
  /** Guilds the user is in */
  readonly guilds: Array<UnavailableGuild>
  /** Used for resuming connections */
  readonly session_id: string
  /** Gateway URL for resuming connections */
  readonly resume_gateway_url: string
  /** Shard information associated with this session, if sent when identifying */
  readonly shard?: Array<number>
  /** Contains id and flags */
  readonly application: Application
}
export type ReceiveEvent =
  | HelloEvent
  | ReadyEvent
  | ResumedEvent
  | ReconnectEvent
  | InvalidSessionEvent
  | ApplicationCommandPermissionsUpdateEvent
  | AutoModerationRuleCreateEvent
  | AutoModerationRuleUpdateEvent
  | AutoModerationRuleDeleteEvent
  | AutoModerationActionExecutionEvent
  | ChannelCreateEvent
  | ChannelUpdateEvent
  | ChannelDeleteEvent
  | ChannelPinsUpdateEvent
  | ThreadCreateEvent
  | ThreadUpdateEvent
  | ThreadDeleteEvent
  | ThreadListSyncEvent
  | ThreadMemberUpdateEvent
  | ThreadMembersUpdateEvent
  | EntitlementCreateEvent
  | EntitlementUpdateEvent
  | EntitlementDeleteEvent
  | GuildCreateEvent
  | GuildUpdateEvent
  | GuildDeleteEvent
  | GuildAuditLogEntryCreateEvent
  | GuildBanAddEvent
  | GuildBanRemoveEvent
  | GuildEmojisUpdateEvent
  | GuildStickersUpdateEvent
  | GuildIntegrationsUpdateEvent
  | GuildMemberAddEvent
  | GuildMemberRemoveEvent
  | GuildMemberUpdateEvent
  | GuildMembersChunkEvent
  | GuildRoleCreateEvent
  | GuildRoleUpdateEvent
  | GuildRoleDeleteEvent
  | GuildScheduledEventCreateEvent
  | GuildScheduledEventUpdateEvent
  | GuildScheduledEventDeleteEvent
  | GuildScheduledEventUserAddEvent
  | GuildScheduledEventUserRemoveEvent
  | IntegrationCreateEvent
  | IntegrationUpdateEvent
  | IntegrationDeleteEvent
  | InteractionCreateEvent
  | InviteCreateEvent
  | InviteDeleteEvent
  | MessageCreateEvent
  | MessageUpdateEvent
  | MessageDeleteEvent
  | MessageDeleteBulkEvent
  | MessageReactionAddEvent
  | MessageReactionRemoveEvent
  | MessageReactionRemoveAllEvent
  | MessageReactionRemoveEmojiEvent
  | PresenceUpdateEvent
  | StageInstanceCreateEvent
  | StageInstanceUpdateEvent
  | StageInstanceDeleteEvent
  | TypingStartEvent
  | UserUpdateEvent
  | VoiceStateUpdateEvent
  | VoiceServerUpdateEvent
  | WebhooksUpdateEvent
export interface ReceiveEvents {
  HELLO: HelloEvent
  READY: ReadyEvent
  RESUMED: ResumedEvent
  RECONNECT: ReconnectEvent
  INVALID_SESSION: InvalidSessionEvent
  APPLICATION_COMMAND_PERMISSIONS_UPDATE: ApplicationCommandPermissionsUpdateEvent
  AUTO_MODERATION_RULE_CREATE: AutoModerationRuleCreateEvent
  AUTO_MODERATION_RULE_UPDATE: AutoModerationRuleUpdateEvent
  AUTO_MODERATION_RULE_DELETE: AutoModerationRuleDeleteEvent
  AUTO_MODERATION_ACTION_EXECUTION: AutoModerationActionExecutionEvent
  CHANNEL_CREATE: ChannelCreateEvent
  CHANNEL_UPDATE: ChannelUpdateEvent
  CHANNEL_DELETE: ChannelDeleteEvent
  CHANNEL_PINS_UPDATE: ChannelPinsUpdateEvent
  THREAD_CREATE: ThreadCreateEvent
  THREAD_UPDATE: ThreadUpdateEvent
  THREAD_DELETE: ThreadDeleteEvent
  THREAD_LIST_SYNC: ThreadListSyncEvent
  THREAD_MEMBER_UPDATE: ThreadMemberUpdateEvent
  THREAD_MEMBERS_UPDATE: ThreadMembersUpdateEvent
  ENTITLEMENT_CREATE: EntitlementCreateEvent
  ENTITLEMENT_UPDATE: EntitlementUpdateEvent
  ENTITLEMENT_DELETE: EntitlementDeleteEvent
  GUILD_CREATE: GuildCreateEvent
  GUILD_UPDATE: GuildUpdateEvent
  GUILD_DELETE: GuildDeleteEvent
  GUILD_AUDIT_LOG_ENTRY_CREATE: GuildAuditLogEntryCreateEvent
  GUILD_BAN_ADD: GuildBanAddEvent
  GUILD_BAN_REMOVE: GuildBanRemoveEvent
  GUILD_EMOJIS_UPDATE: GuildEmojisUpdateEvent
  GUILD_STICKERS_UPDATE: GuildStickersUpdateEvent
  GUILD_INTEGRATIONS_UPDATE: GuildIntegrationsUpdateEvent
  GUILD_MEMBER_ADD: GuildMemberAddEvent
  GUILD_MEMBER_REMOVE: GuildMemberRemoveEvent
  GUILD_MEMBER_UPDATE: GuildMemberUpdateEvent
  GUILD_MEMBERS_CHUNK: GuildMembersChunkEvent
  GUILD_ROLE_CREATE: GuildRoleCreateEvent
  GUILD_ROLE_UPDATE: GuildRoleUpdateEvent
  GUILD_ROLE_DELETE: GuildRoleDeleteEvent
  GUILD_SCHEDULED_EVENT_CREATE: GuildScheduledEventCreateEvent
  GUILD_SCHEDULED_EVENT_UPDATE: GuildScheduledEventUpdateEvent
  GUILD_SCHEDULED_EVENT_DELETE: GuildScheduledEventDeleteEvent
  GUILD_SCHEDULED_EVENT_USER_ADD: GuildScheduledEventUserAddEvent
  GUILD_SCHEDULED_EVENT_USER_REMOVE: GuildScheduledEventUserRemoveEvent
  INTEGRATION_CREATE: IntegrationCreateEvent
  INTEGRATION_UPDATE: IntegrationUpdateEvent
  INTEGRATION_DELETE: IntegrationDeleteEvent
  INTERACTION_CREATE: InteractionCreateEvent
  INVITE_CREATE: InviteCreateEvent
  INVITE_DELETE: InviteDeleteEvent
  MESSAGE_CREATE: MessageCreateEvent
  MESSAGE_UPDATE: MessageUpdateEvent
  MESSAGE_DELETE: MessageDeleteEvent
  MESSAGE_DELETE_BULK: MessageDeleteBulkEvent
  MESSAGE_REACTION_ADD: MessageReactionAddEvent
  MESSAGE_REACTION_REMOVE: MessageReactionRemoveEvent
  MESSAGE_REACTION_REMOVE_ALL: MessageReactionRemoveAllEvent
  MESSAGE_REACTION_REMOVE_EMOJI: MessageReactionRemoveEmojiEvent
  PRESENCE_UPDATE: PresenceUpdateEvent
  STAGE_INSTANCE_CREATE: StageInstanceCreateEvent
  STAGE_INSTANCE_UPDATE: StageInstanceUpdateEvent
  STAGE_INSTANCE_DELETE: StageInstanceDeleteEvent
  TYPING_START: TypingStartEvent
  USER_UPDATE: UserUpdateEvent
  VOICE_STATE_UPDATE: VoiceStateUpdateEvent
  VOICE_SERVER_UPDATE: VoiceServerUpdateEvent
  WEBHOOKS_UPDATE: WebhooksUpdateEvent
}
export type ReconnectEvent = null
export interface RequestGuildMember {
  /** ID of the guild to get members for */
  readonly guild_id: Snowflake
  /** string that username starts with, or an empty string to return all members */
  readonly query?: string
  /** maximum number of members to send matching the query; a limit of 0 can be used with an empty string query to return all members */
  readonly limit: number
  /** used to specify if we want the presences of the matched members */
  readonly presences?: boolean
  /** used to specify which users you wish to fetch */
  readonly user_ids?: Array<Snowflake>
  /** nonce to identify the Guild Members Chunk response */
  readonly nonce?: string
}
export interface ResolvedDatum {
  /** the ids and User objects */
  readonly users?: Record<Snowflake, User>
  /** the ids and partial Member objects */
  readonly members?: Record<Snowflake, GuildMember>
  /** the ids and Role objects */
  readonly roles?: Record<Snowflake, Role>
  /** the ids and partial Channel objects */
  readonly channels?: Record<Snowflake, Channel>
  /** the ids and partial Message objects */
  readonly messages?: Record<Snowflake, Message>
  /** the ids and attachment objects */
  readonly attachments?: Record<Snowflake, Attachment>
}
export interface Response {
  /** the current application */
  readonly application: Application
  /** the scopes the user has authorized the application for */
  readonly scopes: Array<string>
  /** when the access token expires */
  readonly expires: string
  /** the user who has authorized, if the user has authorized with the identify scope */
  readonly user?: User
}
export interface ResponseBody {
  /** the public, archived threads */
  readonly threads: Array<Channel>
  /** a thread member object for each returned thread the current user has joined */
  readonly members: Array<ThreadMember>
  /** whether there are potentially additional threads that could be returned on a subsequent call */
  readonly has_more: boolean
}
export interface Resume {
  /** Session token */
  readonly token: string
  /** Session ID */
  readonly session_id: string
  /** Last sequence number received */
  readonly seq: number
}
export type ResumedEvent = null
export interface Role {
  /** role id */
  readonly id: Snowflake
  /** role name */
  readonly name: string
  /** integer representation of hexadecimal color code */
  readonly color: number
  /** if this role is pinned in the user listing */
  readonly hoist: boolean
  /** role icon hash */
  readonly icon?: string | null
  /** role unicode emoji */
  readonly unicode_emoji?: string | null
  /** position of this role */
  readonly position: number
  /** permission bit set */
  readonly permissions: string
  /** whether this role is managed by an integration */
  readonly managed: boolean
  /** whether this role is mentionable */
  readonly mentionable: boolean
  /** the tags this role has */
  readonly tags?: RoleTag
  /** role flags combined as a bitfield */
  readonly flags: number
}
export const RoleFlag = {
  /** role can be selected by members in an onboarding prompt */
  IN_PROMPT: 1 << 0,
} as const
export interface RoleSubscriptionDatum {
  /** the id of the sku and listing that the user is subscribed to */
  readonly role_subscription_listing_id: Snowflake
  /** the name of the tier that the user is subscribed to */
  readonly tier_name: string
  /** the cumulative number of months that the user has been subscribed for */
  readonly total_months_subscribed: number
  /** whether this notification is for a renewal rather than a new purchase */
  readonly is_renewal: boolean
}
export interface RoleTag {
  /** the id of the bot this role belongs to */
  readonly bot_id?: Snowflake
  /** the id of the integration this role belongs to */
  readonly integration_id?: Snowflake
  /** whether this is the guild's Booster role */
  readonly premium_subscriber?: null
  /** the id of this role's subscription sku and listing */
  readonly subscription_listing_id?: Snowflake
  /** whether this role is available for purchase */
  readonly available_for_purchase?: null
  /** whether this role is a guild's linked role */
  readonly guild_connections?: null
}
export type Route<P, O> = {
  method: string
  url: string
  params?: P
  options?: O
}
export interface SearchGuildMemberParams {
  /** Query string to match username(s) and nickname(s) against. */
  readonly query: string
  /** max number of members to return (1-1000) */
  readonly limit: number
}
export interface SelectDefaultValue {
  /** ID of a user, role, or channel */
  readonly id: Snowflake
  /** Type of value that id represents. Either "user", "role", or "channel" */
  readonly type: string
}
export interface SelectMenu {
  /** Type of select menu component (text: 3, user: 5, role: 6, mentionable: 7, channels: 8) */
  readonly type: ComponentType
  /** ID for the select menu; max 100 characters */
  readonly custom_id: string
  /** Specified choices in a select menu (only required and available for string selects (type 3); max 25 */
  readonly options?: Array<SelectOption>
  /** List of channel types to include in the channel select component (type 8) */
  readonly channel_types?: Array<ChannelType>
  /** Placeholder text if nothing is selected; max 150 characters */
  readonly placeholder?: string
  /** List of default values for auto-populated select menu components; number of default values must be in the range defined by min_values and max_values */
  readonly default_values?: Array<SelectDefaultValue>
  /** Minimum number of items that must be chosen (defaults to 1); min 0, max 25 */
  readonly min_values?: number
  /** Maximum number of items that can be chosen (defaults to 1); max 25 */
  readonly max_values?: number
  /** Whether select menu is disabled (defaults to false) */
  readonly disabled?: boolean
}
export interface SelectOption {
  /** User-facing name of the option; max 100 characters */
  readonly label: string
  /** Dev-defined value of the option; max 100 characters */
  readonly value: string
  /** Additional description of the option; max 100 characters */
  readonly description?: string
  /** id, name, and animated */
  readonly emoji?: Emoji
  /** Will show this option as selected by default */
  readonly default?: boolean
}
export type SendEvent =
  | Identify
  | Resume
  | Heartbeat
  | RequestGuildMember
  | UpdateVoiceState
  | UpdatePresence
export interface SendEvents {
  IDENTIFY: Identify
  RESUME: Resume
  HEARTBEAT: Heartbeat
  REQUEST_GUILD_MEMBERS: RequestGuildMember
  UPDATE_VOICE_STATE: UpdateVoiceState
  UPDATE_PRESENCE: UpdatePresence
}
export interface SessionStartLimit {
  /** Total number of session starts the current user is allowed */
  readonly total: number
  /** Remaining number of session starts the current user is allowed */
  readonly remaining: number
  /** Number of milliseconds after which the limit resets */
  readonly reset_after: number
  /** Number of identify requests allowed per 5 seconds */
  readonly max_concurrency: number
}
export interface Sku {
  /** ID of SKU */
  readonly id: Snowflake
  /** Type of SKU */
  readonly type: SkuType
  /** ID of the parent application */
  readonly application_id: Snowflake
  /** Customer-facing name of your premium offering */
  readonly name: string
  /** System-generated URL slug based on the SKU's name */
  readonly slug: string
  /** SKU flags combined as a bitfield */
  readonly flags: number
}
export const SkuFlag = {
  /** SKU is available for purchase */
  AVAILABLE: 1 << 2,
  /** Recurring SKU that can be purchased by a user and applied to a single server. Grants access to every user in that server. */
  GUILD_SUBSCRIPTION: 1 << 7,
  /** Recurring SKU purchased by a user for themselves. Grants access to the purchasing user in every server. */
  USER_SUBSCRIPTION: 1 << 8,
} as const
export enum SkuType {
  /** Represents a recurring subscription */
  SUBSCRIPTION = 5,
  /** System-generated group for each SUBSCRIPTION SKU created */
  SUBSCRIPTION_GROUP = 6,
}
export type Snowflake = `${bigint}`
export enum SortOrderType {
  /** Sort forum posts by activity */
  LATEST_ACTIVITY = 0,
  /** Sort forum posts by creation time (from most recent to oldest) */
  CREATION_DATE = 1,
}
export interface StageInstance {
  /** The id of this Stage instance */
  readonly id: Snowflake
  /** The guild id of the associated Stage channel */
  readonly guild_id: Snowflake
  /** The id of the associated Stage channel */
  readonly channel_id: Snowflake
  /** The topic of the Stage instance (1-120 characters) */
  readonly topic: string
  /** The privacy level of the Stage instance */
  readonly privacy_level: PrivacyLevel
  /** Whether or not Stage Discovery is disabled (deprecated) */
  readonly discoverable_disabled: boolean
  /** The id of the scheduled event for this Stage instance */
  readonly guild_scheduled_event_id?: Snowflake | null
}
export type StageInstanceCreateEvent = StageInstance
export type StageInstanceDeleteEvent = StageInstance
export type StageInstanceUpdateEvent = StageInstance
export interface StartThreadFromMessageParams {
  /** 1-100 character channel name */
  readonly name: string
  /** the thread will stop showing in the channel list after auto_archive_duration minutes of inactivity, can be set to: 60, 1440, 4320, 10080 */
  readonly auto_archive_duration?: number
  /** amount of seconds a user has to wait before sending another message (0-21600) */
  readonly rate_limit_per_user?: number | null
}
export interface StartThreadInForumOrMediaChannelParams {
  /** 1-100 character channel name */
  readonly name: string
  /** duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080 */
  readonly auto_archive_duration?: number
  /** amount of seconds a user has to wait before sending another message (0-21600) */
  readonly rate_limit_per_user?: number | null
  /** contents of the first message in the forum/media thread */
  readonly message: Message
  /** the IDs of the set of tags that have been applied to a thread in a GUILD_FORUM or a GUILD_MEDIA channel */
  readonly applied_tags?: Array<Snowflake>
  /** Contents of the file being sent. See Uploading Files */
  readonly files?: string
  /** JSON-encoded body of non-file params, only for multipart/form-data requests. See Uploading Files */
  readonly payload_json?: string
}
export interface StartThreadWithoutMessageParams {
  /** 1-100 character channel name */
  readonly name: string
  /** the thread will stop showing in the channel list after auto_archive_duration minutes of inactivity, can be set to: 60, 1440, 4320, 10080 */
  readonly auto_archive_duration?: number
  /** the type of thread to create */
  readonly type?: ChannelType
  /** whether non-moderators can add other non-moderators to a thread; only available when creating a private thread */
  readonly invitable?: boolean
  /** amount of seconds a user has to wait before sending another message (0-21600) */
  readonly rate_limit_per_user?: number | null
}
export enum StatusType {
  /** Online */
  ONLINE = "online",
  /** Do Not Disturb */
  DND = "dnd",
  /** AFK */
  IDLE = "idle",
  /** Invisible and shown as offline */
  INVISIBLE = "invisible",
  /** Offline */
  OFFLINE = "offline",
}
export interface Sticker {
  /** id of the sticker */
  readonly id: Snowflake
  /** for standard stickers, id of the pack the sticker is from */
  readonly pack_id?: Snowflake
  /** name of the sticker */
  readonly name: string
  /** description of the sticker */
  readonly description?: string | null
  /** autocomplete/suggestion tags for the sticker (max 200 characters) */
  readonly tags: string
  /** Deprecated previously the sticker asset hash, now an empty string */
  readonly asset?: string
  /** type of sticker */
  readonly type: StickerType
  /** type of sticker format */
  readonly format_type: StickerFormatType
  /** whether this guild sticker can be used, may be false due to loss of Server Boosts */
  readonly available?: boolean
  /** id of the guild that owns this sticker */
  readonly guild_id?: Snowflake
  /** the user that uploaded the guild sticker */
  readonly user?: User
  /** the standard sticker's sort order within its pack */
  readonly sort_value?: number
}
export enum StickerFormatType {
  PNG = 1,
  APNG = 2,
  LOTTIE = 3,
  GIF = 4,
}
export interface StickerItem {
  /** id of the sticker */
  readonly id: Snowflake
  /** name of the sticker */
  readonly name: string
  /** type of sticker format */
  readonly format_type: StickerFormatType
}
export interface StickerPack {
  /** id of the sticker pack */
  readonly id: Snowflake
  /** the stickers in the pack */
  readonly stickers: Array<Sticker>
  /** name of the sticker pack */
  readonly name: string
  /** id of the pack's SKU */
  readonly sku_id: Snowflake
  /** id of a sticker in the pack which is shown as the pack's icon */
  readonly cover_sticker_id?: Snowflake
  /** description of the sticker pack */
  readonly description: string
  /** id of the sticker pack's banner image */
  readonly banner_asset_id?: Snowflake
}
export enum StickerType {
  /** an official sticker in a pack */
  STANDARD = 1,
  /** a sticker uploaded to a guild for the guild's members */
  GUILD = 2,
}
export const SystemChannelFlag = {
  /** Suppress member join notifications */
  SUPPRESS_JOIN_NOTIFICATIONS: 1 << 0,
  /** Suppress server boost notifications */
  SUPPRESS_PREMIUM_SUBSCRIPTIONS: 1 << 1,
  /** Suppress server setup tips */
  SUPPRESS_GUILD_REMINDER_NOTIFICATIONS: 1 << 2,
  /** Hide member join sticker reply buttons */
  SUPPRESS_JOIN_NOTIFICATION_REPLIES: 1 << 3,
  /** Suppress role subscription purchase and renewal notifications */
  SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS: 1 << 4,
  /** Hide role subscription sticker reply buttons */
  SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATION_REPLIES: 1 << 5,
} as const
export interface Team {
  /** Hash of the image of the team's icon */
  readonly icon?: string | null
  /** Unique ID of the team */
  readonly id: Snowflake
  /** Members of the team */
  readonly members: Array<TeamMember>
  /** Name of the team */
  readonly name: string
  /** User ID of the current team owner */
  readonly owner_user_id: Snowflake
}
export interface TeamMember {
  /** User's membership state on the team */
  readonly membership_state: MembershipState
  /** ID of the parent team of which they are a member */
  readonly team_id: Snowflake
  /** Avatar, discriminator, ID, and username of the user */
  readonly user: User
  /** Role of the team member */
  readonly role: TeamMemberRoleType
}
export enum TeamMemberRoleType {
  /** Owners are the most permissiable role, and can take destructive, irreversible actions like deleting team-owned apps or the team itself. Teams are limited to 1 owner. */
  OWNER = "",
  /** Admins have similar access as owners, except they cannot take destructive actions on the team or team-owned apps. */
  ADMIN = "admin",
  /** Developers can access information about team-owned apps, like the client secret or public key. They can also take limited actions on team-owned apps, like configuring interaction endpoints or resetting the bot token. Members with the Developer role cannot manage the team or its members, or take destructive actions on team-owned apps. */
  DEVELOPER = "developer",
  /** Read-only members can access information about a team and any team-owned apps. Some examples include getting the IDs of applications and exporting payout records. */
  READONLY = "read_only",
}
export interface TextInput {
  /** 4 for a text input */
  readonly type: number
  /** Developer-defined identifier for the input; max 100 characters */
  readonly custom_id: string
  /** The Text Input Style */
  readonly style: TextInputStyle
  /** Label for this component; max 45 characters */
  readonly label: string
  /** Minimum input length for a text input; min 0, max 4000 */
  readonly min_length?: number
  /** Maximum input length for a text input; min 1, max 4000 */
  readonly max_length?: number
  /** Whether this component is required to be filled (defaults to true) */
  readonly required?: boolean
  /** Pre-filled value for this component; max 4000 characters */
  readonly value?: string
  /** Custom placeholder text if the input is empty; max 100 characters */
  readonly placeholder?: string
}
export enum TextInputStyle {
  /** Single-line input */
  SHORT = 1,
  /** Multi-line input */
  PARAGRAPH = 2,
}
export type ThreadCreateEvent = Channel
export type ThreadDeleteEvent = Channel
export interface ThreadListSyncEvent {
  /** ID of the guild */
  readonly guild_id: Snowflake
  /** Parent channel IDs whose threads are being synced.  If omitted, then threads were synced for the entire guild.  This array may contain channel_ids that have no active threads as well, so you know to clear that data. */
  readonly channel_ids?: Array<Snowflake>
  /** All active threads in the given channels that the current user can access */
  readonly threads: Array<Channel>
  /** All thread member objects from the synced threads for the current user, indicating which threads the current user has been added to */
  readonly members: Array<ThreadMember>
}
export interface ThreadMember {
  /** ID of the thread */
  readonly id?: Snowflake
  /** ID of the user */
  readonly user_id?: Snowflake
  /** Time the user last joined the thread */
  readonly join_timestamp: string
  /** Any user-thread settings, currently only used for notifications */
  readonly flags: number
  /** Additional information about the user */
  readonly member?: GuildMember
}
export interface ThreadMembersUpdateEvent {
  /** ID of the thread */
  readonly id: Snowflake
  /** ID of the guild */
  readonly guild_id: Snowflake
  /** Approximate number of members in the thread, capped at 50 */
  readonly member_count: number
  /** Users who were added to the thread */
  readonly added_members?: Array<ThreadMember>
  /** ID of the users who were removed from the thread */
  readonly removed_member_ids?: Array<Snowflake>
}
export type ThreadMemberUpdateEvent = ThreadMember
export interface ThreadMemberUpdateEventExtra {
  /** ID of the guild */
  readonly guild_id: Snowflake
}
export interface ThreadMetadatum {
  /** whether the thread is archived */
  readonly archived: boolean
  /** the thread will stop showing in the channel list after auto_archive_duration minutes of inactivity, can be set to: 60, 1440, 4320, 10080 */
  readonly auto_archive_duration: number
  /** timestamp when the thread's archive status was last changed, used for calculating recent activity */
  readonly archive_timestamp: string
  /** whether the thread is locked; when a thread is locked, only users with MANAGE_THREADS can unarchive it */
  readonly locked: boolean
  /** whether non-moderators can add other non-moderators to a thread; only available on private threads */
  readonly invitable?: boolean
  /** timestamp when the thread was created; only populated for threads created after 2022-01-09 */
  readonly create_timestamp?: string | null
}
export type ThreadUpdateEvent = Channel
export interface TriggerMetadatum {
  /** KEYWORD */
  readonly keyword_filter: Array<string>
  /** KEYWORD */
  readonly regex_patterns: Array<string>
  /** KEYWORD_PRESET */
  readonly presets: Array<KeywordPresetType>
  /** KEYWORD, KEYWORD_PRESET */
  readonly allow_list: Array<string>
  /** MENTION_SPAM */
  readonly mention_total_limit: number
  /** MENTION_SPAM */
  readonly mention_raid_protection_enabled: boolean
}
export enum TriggerType {
  /** check if content contains words from a user defined list of keywords */
  KEYWORD = 1,
  /** check if content represents generic spam */
  SPAM = 3,
  /** check if content contains words from internal pre-defined wordsets */
  KEYWORD_PRESET = 4,
  /** check if content contains more unique mentions than allowed */
  MENTION_SPAM = 5,
}
export interface TypingStartEvent {
  /** ID of the channel */
  readonly channel_id: Snowflake
  /** ID of the guild */
  readonly guild_id?: Snowflake
  /** ID of the user */
  readonly user_id: Snowflake
  /** Unix time (in seconds) of when the user started typing */
  readonly timestamp: number
  /** Member who started typing if this happened in a guild */
  readonly member?: GuildMember
}
export interface UnavailableGuild {
  /**  */
  readonly id: Snowflake
  /**  */
  readonly unavailable: boolean
}
export interface UpdateCurrentUserApplicationRoleConnectionParams {
  /** the vanity name of the platform a bot has connected (max 50 characters) */
  readonly platform_name?: string
  /** the username on the platform a bot has connected (max 100 characters) */
  readonly platform_username?: string
  /** object mapping application role connection metadata keys to their string-ified value (max 100 characters) for the user on the platform a bot has connected */
  readonly metadata?: ApplicationRoleConnectionMetadatum
}
export interface UpdatePresence {
  /** Unix time (in milliseconds) of when the client went idle, or null if the client is not idle */
  readonly since?: number | null
  /** User's activities */
  readonly activities: Array<Activity>
  /** User's new status */
  readonly status: StatusType
  /** Whether or not the client is afk */
  readonly afk: boolean
}
export interface UpdateVoiceState {
  /** ID of the guild */
  readonly guild_id: Snowflake
  /** ID of the voice channel client wants to join (null if disconnecting) */
  readonly channel_id?: Snowflake | null
  /** Whether the client is muted */
  readonly self_mute: boolean
  /** Whether the client deafened */
  readonly self_deaf: boolean
}
export interface User {
  /** the user's id */
  readonly id: Snowflake
  /** the user's username, not unique across the platform */
  readonly username: string
  /** the user's Discord-tag */
  readonly discriminator: string
  /** the user's display name, if it is set. For bots, this is the application name */
  readonly global_name?: string | null
  /** the user's avatar hash */
  readonly avatar?: string | null
  /** whether the user belongs to an OAuth2 application */
  readonly bot?: boolean
  /** whether the user is an Official Discord System user (part of the urgent message system) */
  readonly system?: boolean
  /** whether the user has two factor enabled on their account */
  readonly mfa_enabled?: boolean
  /** the user's banner hash */
  readonly banner?: string | null
  /** the user's banner color encoded as an integer representation of hexadecimal color code */
  readonly accent_color?: number | null
  /** the user's chosen language option */
  readonly locale?: string
  /** whether the email on this account has been verified */
  readonly verified?: boolean
  /** the user's email */
  readonly email?: string | null
  /** the flags on a user's account */
  readonly flags?: number
  /** the type of Nitro subscription on a user's account */
  readonly premium_type?: PremiumType
  /** the public flags on a user's account */
  readonly public_flags?: number
  /** the user's avatar decoration hash */
  readonly avatar_decoration?: string | null
}
export const UserFlag = {
  /** Discord Employee */
  STAFF: 1 << 0,
  /** Partnered Server Owner */
  PARTNER: 1 << 1,
  /** HypeSquad Events Member */
  HYPESQUAD: 1 << 2,
  /** Bug Hunter Level 1 */
  BUG_HUNTER_LEVEL_1: 1 << 3,
  /** House Bravery Member */
  HYPESQUAD_ONLINE_HOUSE_1: 1 << 6,
  /** House Brilliance Member */
  HYPESQUAD_ONLINE_HOUSE_2: 1 << 7,
  /** House Balance Member */
  HYPESQUAD_ONLINE_HOUSE_3: 1 << 8,
  /** Early Nitro Supporter */
  PREMIUM_EARLY_SUPPORTER: 1 << 9,
  /** User is a team */
  TEAM_PSEUDO_USER: 1 << 10,
  /** Bug Hunter Level 2 */
  BUG_HUNTER_LEVEL_2: 1 << 14,
  /** Verified Bot */
  VERIFIED_BOT: 1 << 16,
  /** Early Verified Bot Developer */
  VERIFIED_DEVELOPER: 1 << 17,
  /** Moderator Programs Alumni */
  CERTIFIED_MODERATOR: 1 << 18,
  /** Bot uses only HTTP interactions and is shown in the online member list */
  BOT_HTTP_INTERACTIONS: 1 << 19,
  /** User is an Active Developer */
  ACTIVE_DEVELOPER: 1 << 22,
} as const
export type UserUpdateEvent = User
export enum VerificationLevel {
  /** unrestricted */
  NONE = 0,
  /** must have verified email on account */
  LOW = 1,
  /** must be registered on Discord for longer than 5 minutes */
  MEDIUM = 2,
  /** must be a member of the server for longer than 10 minutes */
  HIGH = 3,
  /** must have a verified phone number */
  VERY_HIGH = 4,
}
export enum VideoQualityMode {
  /** Discord chooses the quality for optimal performance */
  AUTO = 1,
  /** 720p */
  FULL = 2,
}
export enum VisibilityType {
  /** invisible to everyone except the user themselves */
  NONE = 0,
  /** visible to everyone */
  EVERYONE = 1,
}
export enum VoiceOpcode {
  /** Begin a voice websocket connection. */
  IDENTIFY = 0,
  /** Select the voice protocol. */
  SELECT_PROTOCOL = 1,
  /** Complete the websocket handshake. */
  READY = 2,
  /** Keep the websocket connection alive. */
  HEARTBEAT = 3,
  /** Describe the session. */
  SESSION_DESCRIPTION = 4,
  /** Indicate which users are speaking. */
  SPEAKING = 5,
  /** Sent to acknowledge a received client heartbeat. */
  HEARTBEAT_ACK = 6,
  /** Resume a connection. */
  RESUME = 7,
  /** Time to wait between sending heartbeats in milliseconds. */
  HELLO = 8,
  /** Acknowledge a successful session resume. */
  RESUMED = 9,
  /** A client has disconnected from the voice channel */
  CLIENT_DISCONNECT = 13,
}
export interface VoiceRegion {
  /** unique ID for the region */
  readonly id: string
  /** name of the region */
  readonly name: string
  /** true for a single server that is closest to the current user's client */
  readonly optimal: boolean
  /** whether this is a deprecated voice region (avoid switching to these) */
  readonly deprecated: boolean
  /** whether this is a custom voice region (used for events/etc) */
  readonly custom: boolean
}
export interface VoiceServerUpdateEvent {
  /** Voice connection token */
  readonly token: string
  /** Guild this voice server update is for */
  readonly guild_id: Snowflake
  /** Voice server host */
  readonly endpoint?: string | null
}
export interface VoiceState {
  /** the guild id this voice state is for */
  readonly guild_id?: Snowflake
  /** the channel id this user is connected to */
  readonly channel_id?: Snowflake | null
  /** the user id this voice state is for */
  readonly user_id: Snowflake
  /** the guild member this voice state is for */
  readonly member?: GuildMember
  /** the session id for this voice state */
  readonly session_id: string
  /** whether this user is deafened by the server */
  readonly deaf: boolean
  /** whether this user is muted by the server */
  readonly mute: boolean
  /** whether this user is locally deafened */
  readonly self_deaf: boolean
  /** whether this user is locally muted */
  readonly self_mute: boolean
  /** whether this user is streaming using "Go Live" */
  readonly self_stream?: boolean
  /** whether this user's camera is enabled */
  readonly self_video: boolean
  /** whether this user's permission to speak is denied */
  readonly suppress: boolean
  /** the time at which the user requested to speak */
  readonly request_to_speak_timestamp?: string | null
}
export type VoiceStateUpdateEvent = VoiceState
export interface Webhook {
  /** the id of the webhook */
  readonly id: Snowflake
  /** the type of the webhook */
  readonly type: WebhookType
  /** the guild id this webhook is for, if any */
  readonly guild_id?: Snowflake | null
  /** the channel id this webhook is for, if any */
  readonly channel_id?: Snowflake | null
  /** the user this webhook was created by (not returned when getting a webhook with its token) */
  readonly user?: User
  /** the default name of the webhook */
  readonly name?: string | null
  /** the default user avatar hash of the webhook */
  readonly avatar?: string | null
  /** the secure token of the webhook (returned for Incoming Webhooks) */
  readonly token?: string
  /** the bot/OAuth2 application that created this webhook */
  readonly application_id?: Snowflake | null
  /** the guild of the channel that this webhook is following (returned for Channel Follower Webhooks) */
  readonly source_guild?: Guild
  /** the channel that this webhook is following (returned for Channel Follower Webhooks) */
  readonly source_channel?: Channel
  /** the url used for executing the webhook (returned by the webhooks OAuth2 flow) */
  readonly url?: string
}
export interface WebhooksUpdateEvent {
  /** ID of the guild */
  readonly guild_id: Snowflake
  /** ID of the channel */
  readonly channel_id: Snowflake
}
export enum WebhookType {
  /** Incoming Webhooks can post messages to channels with a generated token */
  INCOMING = 1,
  /** Channel Follower Webhooks are internal webhooks used with Channel Following to post new messages into channels */
  CHANNEL_FOLLOWER = 2,
  /** Application webhooks are webhooks used with Interactions */
  APPLICATION = 3,
}
export interface WelcomeScreen {
  /** the server description shown in the welcome screen */
  readonly description?: string | null
  /** the channels shown in the welcome screen, up to 5 */
  readonly welcome_channels: Array<WelcomeScreenChannel>
}
export interface WelcomeScreenChannel {
  /** the channel's id */
  readonly channel_id: Snowflake
  /** the description shown for the channel */
  readonly description: string
  /** the emoji id, if the emoji is custom */
  readonly emoji_id?: Snowflake | null
  /** the emoji name if custom, the unicode character if standard, or null if no emoji is set */
  readonly emoji_name?: string | null
}
