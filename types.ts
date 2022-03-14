import { Response } from "./DiscordREST/types"
export interface ActionRow {
  /** component type */
  type: ComponentType
  /** a list of child components */
  components: Component[]
}
export interface Activity {
  /** the activity's name */
  name: string
  /** activity type */
  type: ActivityType
  /** stream url, is validated when type is 1 */
  url?: string | null
  /** unix timestamp (in milliseconds) of when the activity was added to the user's session */
  created_at: number
  /** unix timestamps for start and/or end of the game */
  timestamps?: ActivityTimestamp
  /** application id for the game */
  application_id?: Snowflake
  /** what the player is currently doing */
  details?: string | null
  /** the user's current party status */
  state?: string | null
  /** the emoji used for a custom status */
  emoji?: ActivityEmoji | null
  /** information for the current party of the player */
  party?: ActivityParty
  /** images for the presence and their hover texts */
  assets?: ActivityAsset
  /** secrets for Rich Presence joining and spectating */
  secrets?: ActivitySecret
  /** whether or not the activity is an instanced game session */
  instance?: boolean
  /** activity flags ORd together, describes what the payload includes */
  flags?: number
  /** the custom buttons shown in the Rich Presence (max 2) */
  buttons?: ActivityButton[]
}
export interface ActivityAsset {
  /** see Activity Asset Image */
  large_image?: string
  /** text displayed when hovering over the large image of the activity */
  large_text?: string
  /** see Activity Asset Image */
  small_image?: string
  /** text displayed when hovering over the small image of the activity */
  small_text?: string
}
export interface ActivityButton {
  /** the text shown on the button (1-32 characters) */
  label: string
  /** the url opened when clicking the button (1-512 characters) */
  url: string
}
export interface ActivityEmoji {
  /** the name of the emoji */
  name: string
  /** the id of the emoji */
  id?: Snowflake
  /** whether this emoji is animated */
  animated?: boolean
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
  /** the id of the party */
  id?: string
  /** used to show the party's current and maximum size */
  size?: number[]
}
export interface ActivitySecret {
  /** the secret for joining a party */
  join?: string
  /** the secret for spectating a game */
  spectate?: string
  /** the secret for a specific instanced match */
  match?: string
}
export interface ActivityTimestamp {
  /** unix time (in milliseconds) of when the activity started */
  start?: number
  /** unix time (in milliseconds) of when the activity ends */
  end?: number
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
  access_token: string
  /** value to set user's nickname to */
  nick: string
  /** array of role ids the member is assigned */
  roles: Snowflake[]
  /** whether the user is muted in voice channels */
  mute: boolean
  /** whether the user is deafened in voice channels */
  deaf: boolean
}
export interface AllowedMention {
  /** An array of allowed mention types to parse from the content. */
  parse: AllowedMentionType[]
  /** Array of role_ids to mention (Max size of 100) */
  roles: Snowflake[]
  /** Array of user_ids to mention (Max size of 100) */
  users: Snowflake[]
  /** For replies, whether to mention the author of the message being replied to (default false) */
  replied_user: boolean
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
  /** the id of the app */
  id: Snowflake
  /** the name of the app */
  name: string
  /** the icon hash of the app */
  icon?: string | null
  /** the description of the app */
  description: string
  /** an array of rpc origin urls, if rpc is enabled */
  rpc_origins?: string[]
  /** when false only app owner can join the app's bot to guilds */
  bot_public: boolean
  /** when true the app's bot will only join upon completion of the full oauth2 code grant flow */
  bot_require_code_grant: boolean
  /** the url of the app's terms of service */
  terms_of_service_url?: string
  /** the url of the app's privacy policy */
  privacy_policy_url?: string
  /** partial user object containing info on the owner of the application */
  owner?: User
  /** if this application is a game sold on Discord, this field will be the summary field for the store page of its primary sku */
  summary: string
  /** the hex encoded key for verification in interactions and the GameSDK's GetTicket */
  verify_key: string
  /** if the application belongs to a team, this will be a list of the members of that team */
  team?: Team | null
  /** if this application is a game sold on Discord, this field will be the guild to which it has been linked */
  guild_id?: Snowflake
  /** if this application is a game sold on Discord, this field will be the id of the "Game SKU" that is created, if exists */
  primary_sku_id?: Snowflake
  /** if this application is a game sold on Discord, this field will be the URL slug that links to the store page */
  slug?: string
  /** the application's default rich presence invite cover image hash */
  cover_image?: string
  /** the application's public flags */
  flags?: number
}
export interface ApplicationCommand {
  /** unique id of the command */
  id: Snowflake
  /** the type of command, defaults 1 if not set */
  type?: ApplicationCommandType
  /** unique id of the parent application */
  application_id: Snowflake
  /** guild id of the command, if not global */
  guild_id?: Snowflake
  /** 1-32 character name */
  name: string
  /** 1-100 character description for CHAT_INPUT commands, empty string for USER and MESSAGE commands */
  description: string
  /** the parameters for the command, max 25 */
  options?: ApplicationCommandOption[]
  /** whether the command is enabled by default when the app is added to a guild */
  default_permission?: boolean
  /** autoincrementing version identifier updated during substantial record changes */
  version: Snowflake
}
export interface ApplicationCommandInteractionDataOption {
  /** the name of the parameter */
  name: string
  /** value of application command option type */
  type: ApplicationCommandOptionType
  /** the value of the option resulting from user input */
  value?: string
  /** present if this option is a group or subcommand */
  options?: ApplicationCommandInteractionDataOption[]
  /** true if this option is the currently focused option for autocomplete */
  focused?: boolean
}
export interface ApplicationCommandOption {
  /** the type of option */
  type: any
  /** 1-32 character name */
  name: string
  /** 1-100 character description */
  description: string
  /** if the parameter is required or optional--default false */
  required?: boolean
  /** choices for STRING, INTEGER, and NUMBER types for the user to pick from, max 25 */
  choices?: ApplicationCommandOptionChoice[]
  /** if the option is a subcommand or subcommand group type, these nested options will be the parameters */
  options?: ApplicationCommandOption[]
  /** if the option is a channel type, the channels shown will be restricted to these types */
  channel_types?: ChannelType[]
  /** if the option is an INTEGER or NUMBER type, the minimum value permitted */
  min_value?: number
  /** if the option is an INTEGER or NUMBER type, the maximum value permitted */
  max_value?: number
  /** if autocomplete interactions are enabled for this STRING, INTEGER, or NUMBER type option */
  autocomplete?: boolean
}
export interface ApplicationCommandOptionChoice {
  /** 1-100 character choice name */
  name: string
  /** value of the choice, up to 100 characters if string */
  value: string
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
  /** the id of the role or user */
  id: Snowflake
  /** role or user */
  type: ApplicationCommandPermissionType
  /** true to allow, false, to disallow */
  permission: boolean
}
export enum ApplicationCommandPermissionType {
  ROLE = 1,
  USER = 2,
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
  /** Intent required for bots in 100 or more servers to receive presence_update events */
  GATEWAY_PRESENCE: 1 << 12,
  /** Intent required for bots in under 100 servers to receive presence_update events, found in Bot Settings */
  GATEWAY_PRESENCE_LIMITED: 1 << 13,
  /** Intent required for bots in 100 or more servers to receive member-related events like guild_member_add. See list of member-related events under GUILD_MEMBERS */
  GATEWAY_GUILD_MEMBERS: 1 << 14,
  /** Intent required for bots in under 100 servers to receive member-related events like guild_member_add, found in Bot Settings. See list of member-related events under GUILD_MEMBERS */
  GATEWAY_GUILD_MEMBERS_LIMITED: 1 << 15,
  /** Indicates unusual growth of an app that prevents verification */
  VERIFICATION_PENDING_GUILD_LIMIT: 1 << 16,
  /** Indicates if an app is embedded within the Discord client (currently unavailable publicly) */
  EMBEDDED: 1 << 17,
  /** Intent required for bots in 100 or more servers to receive message content */
  GATEWAY_MESSAGE_CONTENT: 1 << 18,
  /** Intent required for bots in under 100 servers to receive message content, found in Bot Settings */
  GATEWAY_MESSAGE_CONTENT_LIMITED: 1 << 19,
} as const
export interface Attachment {
  /** attachment id */
  id: Snowflake
  /** name of file attached */
  filename: string
  /** description for the file */
  description?: string
  /** the attachment's media type */
  content_type?: string
  /** size of file in bytes */
  size: number
  /** source url of file */
  url: string
  /** a proxied url of file */
  proxy_url: string
  /** height of file (if image) */
  height?: number | null
  /** width of file (if image) */
  width?: number | null
  /** whether this attachment is ephemeral */
  ephemeral?: boolean
}
export interface AuditEntryInfo {
  /** channel in which the entities were targeted */
  channel_id: Snowflake
  /** number of entities that were targeted */
  count: string
  /** number of days after which inactive members were kicked */
  delete_member_days: string
  /** id of the overwritten entity */
  id: Snowflake
  /** number of members removed by the prune */
  members_removed: string
  /** id of the message that was targeted */
  message_id: Snowflake
  /** name of the role if type is "0" (not present if type is "1") */
  role_name: string
  /** type of overwritten entity - "0" for "role" or "1" for "member" */
  type: string
}
export interface AuditLog {
  /** list of audit log entries */
  audit_log_entries: AuditLogEntry[]
  /** list of guild scheduled events found in the audit log */
  guild_scheduled_events: GuildScheduledEvent[]
  /** list of partial integration objects */
  integrations: Integration[]
  /** list of threads found in the audit log* */
  threads: Channel[]
  /** list of users found in the audit log */
  users: User[]
  /** list of webhooks found in the audit log */
  webhooks: Webhook[]
}
export interface AuditLogChange {
  /** new value of the key */
  new_value?: any
  /** old value of the key */
  old_value?: any
  /** name of audit log change key */
  key: string
}
export interface AuditLogEntry {
  /** id of the affected entity (webhook, user, role, etc.) */
  target_id?: string | null
  /** changes made to the target_id */
  changes?: AuditLogChange[]
  /** the user who made the changes */
  user_id?: Snowflake | null
  /** id of the entry */
  id: Snowflake
  /** type of action that occurred */
  action_type: AuditLogEvent
  /** additional info for certain action types */
  options?: AuditEntryInfo
  /** the reason for the change (0-512 characters) */
  reason?: string
}
export enum AuditLogEvent {
  GUILD_UPDATE = 1,
  CHANNEL_CREATE = 10,
  CHANNEL_UPDATE = 11,
  CHANNEL_DELETE = 12,
  CHANNEL_OVERWRITE_CREATE = 13,
  CHANNEL_OVERWRITE_UPDATE = 14,
  CHANNEL_OVERWRITE_DELETE = 15,
  MEMBER_KICK = 20,
  MEMBER_PRUNE = 21,
  MEMBER_BAN_ADD = 22,
  MEMBER_BAN_REMOVE = 23,
  MEMBER_UPDATE = 24,
  MEMBER_ROLE_UPDATE = 25,
  MEMBER_MOVE = 26,
  MEMBER_DISCONNECT = 27,
  BOT_ADD = 28,
  ROLE_CREATE = 30,
  ROLE_UPDATE = 31,
  ROLE_DELETE = 32,
  INVITE_CREATE = 40,
  INVITE_UPDATE = 41,
  INVITE_DELETE = 42,
  WEBHOOK_CREATE = 50,
  WEBHOOK_UPDATE = 51,
  WEBHOOK_DELETE = 52,
  EMOJI_CREATE = 60,
  EMOJI_UPDATE = 61,
  EMOJI_DELETE = 62,
  MESSAGE_DELETE = 72,
  MESSAGE_BULK_DELETE = 73,
  MESSAGE_PIN = 74,
  MESSAGE_UNPIN = 75,
  INTEGRATION_CREATE = 80,
  INTEGRATION_UPDATE = 81,
  INTEGRATION_DELETE = 82,
  STAGE_INSTANCE_CREATE = 83,
  STAGE_INSTANCE_UPDATE = 84,
  STAGE_INSTANCE_DELETE = 85,
  STICKER_CREATE = 90,
  STICKER_UPDATE = 91,
  STICKER_DELETE = 92,
  GUILD_SCHEDULED_EVENT_CREATE = 100,
  GUILD_SCHEDULED_EVENT_UPDATE = 101,
  GUILD_SCHEDULED_EVENT_DELETE = 102,
  THREAD_CREATE = 110,
  THREAD_UPDATE = 111,
  THREAD_DELETE = 112,
}
export interface Ban {
  /** the reason for the ban */
  reason?: string | null
  /** the banned user */
  user: User
}
export interface BeginGuildPruneParams {
  /** number of days to prune (1-30) */
  days: number
  /** whether 'pruned' is returned, discouraged for large guilds */
  compute_prune_count: boolean
  /** role(s) to include */
  include_roles: Snowflake[]
  /** reason for the prune (deprecated) */
  reason?: string
}
export interface BulkDeleteMessageParams {
  /** an array of message ids to delete (2-100) */
  messages: Snowflake[]
}
export interface Button {
  /** 2 for a button */
  type: number
  /** one of button styles */
  style: ButtonStyle
  /** text that appears on the button, max 80 characters */
  label?: string
  /** name, id, and animated */
  emoji?: Emoji
  /** a developer-defined identifier for the button, max 100 characters */
  custom_id?: string
  /** a url for link-style buttons */
  url?: string
  /** whether the button is disabled (default false) */
  disabled?: boolean
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
  id: Snowflake
  /** the type of channel */
  type: ChannelType
  /** the id of the guild (may be missing for some channel objects received over gateway guild dispatches) */
  guild_id?: Snowflake
  /** sorting position of the channel */
  position?: number
  /** explicit permission overwrites for members and roles */
  permission_overwrites?: Overwrite[]
  /** the name of the channel (1-100 characters) */
  name?: string
  /** the channel topic (0-1024 characters) */
  topic?: string | null
  /** whether the channel is nsfw */
  nsfw?: boolean
  /** the id of the last message sent in this channel (may not point to an existing or valid message) */
  last_message_id?: Snowflake | null
  /** the bitrate (in bits) of the voice channel */
  bitrate?: number
  /** the user limit of the voice channel */
  user_limit?: number
  /** amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission manage_messages or manage_channel, are unaffected */
  rate_limit_per_user?: number
  /** the recipients of the DM */
  recipients?: User[]
  /** icon hash of the group DM */
  icon?: string | null
  /** id of the creator of the group DM or thread */
  owner_id?: Snowflake
  /** application id of the group DM creator if it is bot-created */
  application_id?: Snowflake
  /** for guild channels: id of the parent category for a channel (each parent category can contain up to 50 channels), for threads: id of the text channel this thread was created */
  parent_id?: Snowflake | null
  /** when the last pinned message was pinned. This may be null in events such as GUILD_CREATE when a message is not pinned. */
  last_pin_timestamp?: string | null
  /** voice region id for the voice channel, automatic when set to null */
  rtc_region?: string | null
  /** the camera video quality mode of the voice channel, 1 when not present */
  video_quality_mode?: VideoQualityMode
  /** an approximate count of messages in a thread, stops counting at 50 */
  message_count?: number
  /** an approximate count of users in a thread, stops counting at 50 */
  member_count?: number
  /** thread-specific fields not needed by other channels */
  thread_metadata?: ThreadMetadatum
  /** thread member object for the current user, if they have joined the thread, only included on certain API endpoints */
  member?: ThreadMember
  /** default duration that the clients (not the API) will use for newly created threads, in minutes, to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080 */
  default_auto_archive_duration?: number
  /** computed permissions for the invoking user in the channel, including overwrites, only included when part of the resolved data received on a slash command interaction */
  permissions?: string
}
export type ChannelCreateEvent = Channel
export type ChannelDeleteEvent = Channel
export interface ChannelMention {
  /** id of the channel */
  id: Snowflake
  /** id of the guild containing the channel */
  guild_id: Snowflake
  /** the type of channel */
  type: ChannelType
  /** the name of the channel */
  name: string
}
export interface ChannelPinsUpdateEvent {
  /** the id of the guild */
  guild_id?: Snowflake
  /** the id of the channel */
  channel_id: Snowflake
  /** the time at which the most recent pinned message was pinned */
  last_pin_timestamp?: string | null
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
  /** a channel that users can follow and crosspost into their own server */
  GUILD_NEWS = 5,
  /** a channel in which game developers can sell their game on Discord */
  GUILD_STORE = 6,
  /** a temporary sub-channel within a GUILD_NEWS channel */
  GUILD_NEWS_THREAD = 10,
  /** a temporary sub-channel within a GUILD_TEXT channel */
  GUILD_PUBLIC_THREAD = 11,
  /** a temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission */
  GUILD_PRIVATE_THREAD = 12,
  /** a voice channel for hosting events with an audience */
  GUILD_STAGE_VOICE = 13,
}
export type ChannelUpdateEvent = Channel
export interface ClientStatus {
  /** the user's status set for an active desktop (Windows, Linux, Mac) application session */
  desktop?: string
  /** the user's status set for an active mobile (iOS, Android) application session */
  mobile?: string
  /** the user's status set for an active web (browser, bot account) application session */
  web?: string
}
export type Component = ActionRow | Button | TextInput | SelectMenu
export enum ComponentType {
  /** A container for other components */
  ACTION_ROW = 1,
  /** A button object */
  BUTTON = 2,
  /** A select menu for picking from choices */
  SELECT_MENU = 3,
  /** A text input object */
  TEXT_INPUT = 4,
}
export interface Connection {
  /** id of the connection account */
  id: string
  /** the username of the connection account */
  name: string
  /** the service of the connection (twitch, youtube) */
  type: string
  /** whether the connection is revoked */
  revoked?: boolean
  /** an array of partial server integrations */
  integrations?: Integration[]
  /** whether the connection is verified */
  verified: boolean
  /** whether friend sync is enabled for this connection */
  friend_sync: boolean
  /** whether activities related to this connection will be shown in presence updates */
  show_activity: boolean
  /** visibility of this connection */
  visibility: VisibilityType
}
export interface CreateChannelInviteParams {
  /** duration of invite in seconds before expiry, or 0 for never. between 0 and 604800 (7 days) */
  max_age: number
  /** max number of uses or 0 for unlimited. between 0 and 100 */
  max_uses: number
  /** whether this invite only grants temporary membership */
  temporary: boolean
  /** if true, don't try to reuse a similar invite (useful for creating many unique one time use invites) */
  unique: boolean
  /** the type of target for this voice channel invite */
  target_type: InviteTargetType
  /** the id of the user whose stream to display for this invite, required if target_type is 1, the user must be streaming in the channel */
  target_user_id: Snowflake
  /** the id of the embedded application to open for this invite, required if target_type is 2, the application must have the EMBEDDED flag */
  target_application_id: Snowflake
}
export interface CreateDmParams {
  /** the recipient to open a DM channel with */
  recipient_id: Snowflake
}
export interface CreateGlobalApplicationCommandParams {
  /** 1-32 character name */
  name: string
  /** 1-100 character description */
  description: string
  /** the parameters for the command */
  options?: ApplicationCommandOption[]
  /** whether the command is enabled by default when the app is added to a guild */
  default_permission?: boolean
  /** the type of command, defaults 1 if not set */
  type?: ApplicationCommandType
}
export interface CreateGroupDmParams {
  /** access tokens of users that have granted your app the gdm.join scope */
  access_tokens: string[]
  /** a dictionary of user ids to their respective nicknames */
  nicks: Record<string, string>
}
export interface CreateGuildApplicationCommandParams {
  /** 1-32 character name */
  name: string
  /** 1-100 character description */
  description: string
  /** the parameters for the command */
  options?: ApplicationCommandOption[]
  /** whether the command is enabled by default when the app is added to a guild */
  default_permission?: boolean
  /** the type of command, defaults 1 if not set */
  type?: ApplicationCommandType
}
export interface CreateGuildBanParams {
  /** number of days to delete messages for (0-7) */
  delete_message_days?: number
  /** reason for the ban (deprecated) */
  reason?: string
}
export interface CreateGuildChannelParams {
  /** channel name (1-100 characters) */
  name: string
  /** the type of channel */
  type: ChannelType
  /** channel topic (0-1024 characters) */
  topic: string
  /** the bitrate (in bits) of the voice channel (voice only) */
  bitrate: number
  /** the user limit of the voice channel (voice only) */
  user_limit: number
  /** amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission manage_messages or manage_channel, are unaffected */
  rate_limit_per_user: number
  /** sorting position of the channel */
  position: number
  /** the channel's permission overwrites */
  permission_overwrites: Overwrite[]
  /** id of the parent category for a channel */
  parent_id: Snowflake
  /** whether the channel is nsfw */
  nsfw: boolean
}
export interface CreateGuildEmojiParams {
  /** name of the emoji */
  name: string
  /** the 128x128 emoji image */
  image: string
  /** roles allowed to use this emoji */
  roles: Snowflake[]
}
export interface CreateGuildFromGuildTemplateParams {
  /** name of the guild (2-100 characters) */
  name: string
  /** base64 128x128 image for the guild icon */
  icon?: string
}
export interface CreateGuildParams {
  /** name of the guild (2-100 characters) */
  name: string
  /** voice region id (deprecated) */
  region?: string | null
  /** base64 128x128 image for the guild icon */
  icon?: string
  /** verification level */
  verification_level?: VerificationLevel
  /** default message notification level */
  default_message_notifications?: DefaultMessageNotificationLevel
  /** explicit content filter level */
  explicit_content_filter?: ExplicitContentFilterLevel
  /** new guild roles */
  roles?: Role[]
  /** new guild's channels */
  channels?: Channel[]
  /** id for afk channel */
  afk_channel_id?: Snowflake
  /** afk timeout in seconds */
  afk_timeout?: number
  /** the id of the channel where guild notices such as welcome messages and boost events are posted */
  system_channel_id?: Snowflake
  /** system channel flags */
  system_channel_flags?: number
}
export interface CreateGuildRoleParams {
  /** name of the role */
  name: string
  /** bitwise value of the enabled/disabled permissions */
  permissions: string
  /** RGB color value */
  color: number
  /** whether the role should be displayed separately in the sidebar */
  hoist: boolean
  /** the role's icon image (if the guild has the ROLE_ICONS feature) */
  icon?: string | null
  /** the role's unicode emoji as a standard emoji (if the guild has the ROLE_ICONS feature) */
  unicode_emoji?: string | null
  /** whether the role should be mentionable */
  mentionable: boolean
}
export interface CreateGuildScheduledEventParams {
  /** the channel id of the scheduled event. */
  channel_id?: Snowflake
  /** the entity metadata of the scheduled event */
  entity_metadata?: GuildScheduledEventEntityMetadatum
  /** the name of the scheduled event */
  name: string
  /** the privacy level of the scheduled event */
  privacy_level: GuildScheduledEventPrivacyLevel
  /** the time to schedule the scheduled event */
  scheduled_start_time: string
  /** the time when the scheduled event is scheduled to end */
  scheduled_end_time?: string
  /** the description of the scheduled event */
  description?: string
  /** the entity type of the scheduled event */
  entity_type: GuildScheduledEventEntityType
  /** the cover image of the scheduled event */
  image?: string
}
export interface CreateGuildStickerParams {
  /** name of the sticker (2-30 characters) */
  name: string
  /** description of the sticker (empty or 2-100 characters) */
  description: string
  /** autocomplete/suggestion tags for the sticker (max 200 characters) */
  tags: string
  /** the sticker file to upload, must be a PNG, APNG, or Lottie JSON file, max 500 KB */
  file: string
}
export interface CreateGuildTemplateParams {
  /** name of the template (1-100 characters) */
  name: string
  /** description for the template (0-120 characters) */
  description?: string | null
}
export interface CreateMessageParams {
  /** the message contents (up to 2000 characters) */
  content: string
  /** true if this is a TTS message */
  tts: boolean
  /** embedded rich content (up to 6000 characters) */
  embeds: Embed[]
  /** embedded rich content, deprecated in favor of embeds */
  embed: Embed
  /** allowed mentions for the message */
  allowed_mentions: AllowedMention
  /** include to make your message a reply */
  message_reference: MessageReference
  /** the components to include with the message */
  components: Component[]
  /** IDs of up to 3 stickers in the server to send in the message */
  sticker_ids: Snowflake[]
  /** the contents of the file being sent */
  files: string
  /** JSON encoded body of non-file params */
  payload_json: string
  /** attachment objects with filename and description */
  attachments: Attachment[]
  /** message flags combined as a bitfield (only SUPPRESS_EMBEDS can be set) */
  flags: number
}
export function createRoutes<O = any>(
  fetch: <R, P>(route: Route<P, O>) => Response<R>
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
    batchEditApplicationCommandPermissions: (
      applicationId,
      guildId,
      params,
      options
    ) =>
      fetch({
        method: "PUT",
        url: `/applications/${applicationId}/guilds/${guildId}/commands/permissions`,
        params,
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
    bulkOverwriteGuildApplicationCommands: (applicationId, guildId, options) =>
      fetch({
        method: "PUT",
        url: `/applications/${applicationId}/guilds/${guildId}/commands`,
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
    createFollowupMessage: (applicationId, interactionToken, options) =>
      fetch({
        method: "POST",
        url: `/webhooks/${applicationId}/${interactionToken}`,
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
      options
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
      options
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
      options
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
      options
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
      options
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
      options
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
    editFollowupMessage: (
      applicationId,
      interactionToken,
      messageId,
      options
    ) =>
      fetch({
        method: "PATCH",
        url: `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`,
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
      options
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
      options
    ) =>
      fetch({
        method: "PATCH",
        url: `/webhooks/${applicationId}/${interactionToken}/messages/@original`,
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
    followNewsChannel: (channelId, params, options) =>
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
      options
    ) =>
      fetch({
        method: "GET",
        url: `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`,
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
    getCurrentUser: (options) =>
      fetch({
        method: "GET",
        url: `/users/@me`,
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
    getFollowupMessage: (applicationId, interactionToken, messageId, options) =>
      fetch({
        method: "GET",
        url: `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`,
        options,
      }),
    getGateway: (options) =>
      fetch({
        method: "GET",
        url: `/gateway`,
        options,
      }),
    getGatewayBot: (options) =>
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
    getGlobalApplicationCommands: (applicationId, options) =>
      fetch({
        method: "GET",
        url: `/applications/${applicationId}/commands`,
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
    getGuildApplicationCommands: (applicationId, guildId, options) =>
      fetch({
        method: "GET",
        url: `/applications/${applicationId}/guilds/${guildId}/commands`,
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
    getGuildBans: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/bans`,
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
      options
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
      options
    ) =>
      fetch({
        method: "GET",
        url: `/webhooks/${applicationId}/${interactionToken}/messages/@original`,
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
    getThreadMember: (channelId, userId, options) =>
      fetch({
        method: "GET",
        url: `/channels/${channelId}/thread-members/${userId}`,
        options,
      }),
    getUser: (userId, options) =>
      fetch({
        method: "GET",
        url: `/users/${userId}`,
        options,
      }),
    getUserConnections: (options) =>
      fetch({
        method: "GET",
        url: `/users/@me/connections`,
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
    listActiveThreads: (channelId, options) =>
      fetch({
        method: "GET",
        url: `/channels/${channelId}/threads/active`,
        options,
      }),
    listGuildActiveThreads: (guildId, options) =>
      fetch({
        method: "GET",
        url: `/guilds/${guildId}/threads/active`,
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
    listNitroStickerPacks: (options) =>
      fetch({
        method: "GET",
        url: `/sticker-packs`,
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
    listThreadMembers: (channelId, options) =>
      fetch({
        method: "GET",
        url: `/channels/${channelId}/thread-members`,
        options,
      }),
    listVoiceRegions: (options) =>
      fetch({
        method: "GET",
        url: `/voice/regions`,
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
      options
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
    startThreadWithMessage: (channelId, messageId, params, options) =>
      fetch({
        method: "POST",
        url: `/channels/${channelId}/messages/${messageId}/threads`,
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
  }
}
export interface CreateStageInstanceParams {
  /** The id of the Stage channel */
  channel_id: Snowflake
  /** The topic of the Stage instance (1-120 characters) */
  topic: string
  /** The privacy level of the Stage instance (default GUILD_ONLY) */
  privacy_level?: PrivacyLevel
}
export interface CreateWebhookParams {
  /** name of the webhook (1-80 characters) */
  name: string
  /** image for the default webhook avatar */
  avatar?: string | null
}
export enum DefaultMessageNotificationLevel {
  /** members will receive notifications for all messages by default */
  ALL_MESSAGES = 0,
  /** members will receive notifications only for messages that @mention them by default */
  ONLY_MENTIONS = 1,
}
export interface DeleteWebhookMessageParams {
  /** id of the thread the message is in */
  thread_id: Snowflake
}
export interface EditApplicationCommandPermissionParams {
  /** the permissions for the command in the guild */
  permissions: ApplicationCommandPermission[]
}
export interface EditChannelPermissionParams {
  /** the bitwise value of all allowed permissions (default "0") */
  allow?: string
  /** the bitwise value of all disallowed permissions (default "0") */
  deny?: string
  /** 0 for a role or 1 for a member */
  type: number
}
export interface EditGlobalApplicationCommandParams {
  /** 1-32 character name */
  name?: string
  /** 1-100 character description */
  description?: string
  /** the parameters for the command */
  options?: ApplicationCommandOption[]
  /** whether the command is enabled by default when the app is added to a guild */
  default_permission?: boolean
}
export interface EditGuildApplicationCommandParams {
  /** 1-32 character name */
  name?: string
  /** 1-100 character description */
  description?: string
  /** the parameters for the command */
  options?: ApplicationCommandOption[]
  /** whether the command is enabled by default when the app is added to a guild */
  default_permission?: boolean
}
export interface EditMessageParams {
  /** the message contents (up to 2000 characters) */
  content: string
  /** embedded rich content (up to 6000 characters) */
  embeds: Embed[]
  /** embedded rich content, deprecated in favor of embeds */
  embed: Embed
  /** edit the flags of a message (only SUPPRESS_EMBEDS can currently be set/unset) */
  flags: number
  /** allowed mentions for the message */
  allowed_mentions: AllowedMention
  /** the components to include with the message */
  components: Component[]
  /** the contents of the file being sent/edited */
  files: string
  /** JSON encoded body of non-file params (multipart/form-data only) */
  payload_json: string
  /** attached files to keep and possible descriptions for new files */
  attachments: Attachment[]
}
export interface EditWebhookMessageParams {
  /** the message contents (up to 2000 characters) */
  content: string
  /** embedded rich content */
  embeds: Embed[]
  /** allowed mentions for the message */
  allowed_mentions: AllowedMention
  /** the components to include with the message */
  components: Component[]
  /** the contents of the file being sent/edited */
  files: string
  /** JSON encoded body of non-file params (multipart/form-data only) */
  payload_json: string
  /** attached files to keep and possible descriptions for new files */
  attachments: Attachment[]
}
export interface Embed {
  /** title of embed */
  title?: string
  /** type of embed (always "rich" for webhook embeds) */
  type?: EmbedType
  /** description of embed */
  description?: string
  /** url of embed */
  url?: string
  /** timestamp of embed content */
  timestamp?: string
  /** color code of the embed */
  color?: number
  /** footer information */
  footer?: EmbedFooter
  /** image information */
  image?: EmbedImage
  /** thumbnail information */
  thumbnail?: EmbedThumbnail
  /** video information */
  video?: EmbedVideo
  /** provider information */
  provider?: EmbedProvider
  /** author information */
  author?: EmbedAuthor
  /** fields information */
  fields?: EmbedField[]
}
export interface EmbedAuthor {
  /** name of author */
  name: string
  /** url of author */
  url?: string
  /** url of author icon (only supports http(s) and attachments) */
  icon_url?: string
  /** a proxied url of author icon */
  proxy_icon_url?: string
}
export interface EmbedField {
  /** name of the field */
  name: string
  /** value of the field */
  value: string
  /** whether or not this field should display inline */
  inline?: boolean
}
export interface EmbedFooter {
  /** footer text */
  text: string
  /** url of footer icon (only supports http(s) and attachments) */
  icon_url?: string
  /** a proxied url of footer icon */
  proxy_icon_url?: string
}
export interface EmbedImage {
  /** source url of image (only supports http(s) and attachments) */
  url: string
  /** a proxied url of the image */
  proxy_url?: string
  /** height of image */
  height?: number
  /** width of image */
  width?: number
}
export interface EmbedProvider {
  /** name of provider */
  name?: string
  /** url of provider */
  url?: string
}
export interface EmbedThumbnail {
  /** source url of thumbnail (only supports http(s) and attachments) */
  url: string
  /** a proxied url of the thumbnail */
  proxy_url?: string
  /** height of thumbnail */
  height?: number
  /** width of thumbnail */
  width?: number
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
  url?: string
  /** a proxied url of the video */
  proxy_url?: string
  /** height of video */
  height?: number
  /** width of video */
  width?: number
}
export interface Emoji {
  /** emoji id */
  id?: Snowflake | null
  /** emoji name */
  name?: string | null
  /** roles allowed to use this emoji */
  roles?: Snowflake[]
  /** user that created this emoji */
  user?: User
  /** whether this emoji must be wrapped in colons */
  require_colons?: boolean
  /** whether this emoji is managed */
  managed?: boolean
  /** whether this emoji is animated */
  animated?: boolean
  /** whether this emoji can be used, may be false due to loss of Server Boosts */
  available?: boolean
}
export interface Endpoints<O> {
  /** Adds a user to the guild, provided you have a valid oauth2 access token for the user with the guilds.join scope. Returns a 201 Created with the guild member as the body, or 204 No Content if the user is already a member of the guild. Fires a Guild Member Add Gateway event. */
  addGuildMember: (
    guildId: string,
    userId: string,
    params?: Partial<AddGuildMemberParams>,
    options?: O
  ) => Response<GuildMember>
  /** Adds a role to a guild member. Requires the MANAGE_ROLES permission. Returns a 204 empty response on success. Fires a Guild Member Update Gateway event. */
  addGuildMemberRole: (
    guildId: string,
    userId: string,
    roleId: string,
    options?: O
  ) => Response<any>
  /** Adds another member to a thread. Requires the ability to send messages in the thread. Also requires the thread is not archived. Returns a 204 empty response if the member is successfully added or was already a member of the thread. Fires a Thread Members Update Gateway event. */
  addThreadMember: (
    channelId: string,
    userId: string,
    options?: O
  ) => Response<any>
  batchEditApplicationCommandPermissions: (
    applicationId: string,
    guildId: string,
    params?: Partial<GuildApplicationCommandPermission[]>,
    options?: O
  ) => Response<GuildApplicationCommandPermission[]>
  /** Begin a prune operation. Requires the KICK_MEMBERS permission. Returns an object with one 'pruned' key indicating the number of members that were removed in the prune operation. For large guilds it's recommended to set the compute_prune_count option to false, forcing 'pruned' to null. Fires multiple Guild Member Remove Gateway events. */
  beginGuildPrune: (
    guildId: string,
    params?: Partial<BeginGuildPruneParams>,
    options?: O
  ) => Response<any>
  /** Delete multiple messages in a single request. This endpoint can only be used on guild channels and requires the MANAGE_MESSAGES permission. Returns a 204 empty response on success. Fires a Message Delete Bulk Gateway event. */
  bulkDeleteMessages: (
    channelId: string,
    params?: Partial<BulkDeleteMessageParams>,
    options?: O
  ) => Response<any>
  /** Takes a list of application commands, overwriting the existing global command list for this application. Updates will be available in all guilds after 1 hour. Returns 200 and a list of application command objects. Commands that do not already exist will count toward daily application command create limits. */
  bulkOverwriteGlobalApplicationCommands: (
    applicationId: string,
    options?: O
  ) => Response<ApplicationCommand[]>
  /** Takes a list of application commands, overwriting the existing command list for this application for the targeted guild. Returns 200 and a list of application command objects. */
  bulkOverwriteGuildApplicationCommands: (
    applicationId: string,
    guildId: string,
    options?: O
  ) => Response<ApplicationCommand[]>
  /** Create a new invite object for the channel. Only usable for guild channels. Requires the CREATE_INSTANT_INVITE permission. All JSON parameters for this route are optional, however the request body is not. If you are not sending any fields, you still have to send an empty JSON object ({}). Returns an invite object. Fires an Invite Create Gateway event. */
  createChannelInvite: (
    channelId: string,
    params?: Partial<CreateChannelInviteParams>,
    options?: O
  ) => Response<Invite>
  /** Create a new DM channel with a user. Returns a DM channel object. */
  createDm: (params?: Partial<CreateDmParams>, options?: O) => Response<Channel>
  /** Create a followup message for an Interaction. Functions the same as Execute Webhook, but wait is always true, and flags can be set to 64 in the body to send an ephemeral message. The thread_id, avatar_url, and username parameters are not supported when using this endpoint for interaction followups. */
  createFollowupMessage: (
    applicationId: string,
    interactionToken: string,
    options?: O
  ) => Response<any>
  createGlobalApplicationCommand: (
    applicationId: string,
    params?: Partial<CreateGlobalApplicationCommandParams>,
    options?: O
  ) => Response<ApplicationCommand>
  /** Create a new group DM channel with multiple users. Returns a DM channel object. This endpoint was intended to be used with the now-deprecated GameBridge SDK. DMs created with this endpoint will not be shown in the Discord client */
  createGroupDm: (
    params?: Partial<CreateGroupDmParams>,
    options?: O
  ) => Response<Channel>
  /** Create a new guild. Returns a guild object on success. Fires a Guild Create Gateway event. */
  createGuild: (
    params?: Partial<CreateGuildParams>,
    options?: O
  ) => Response<Guild>
  createGuildApplicationCommand: (
    applicationId: string,
    guildId: string,
    params?: Partial<CreateGuildApplicationCommandParams>,
    options?: O
  ) => Response<ApplicationCommand>
  /** Create a guild ban, and optionally delete previous messages sent by the banned user. Requires the BAN_MEMBERS permission. Returns a 204 empty response on success. Fires a Guild Ban Add Gateway event. */
  createGuildBan: (
    guildId: string,
    userId: string,
    params?: Partial<CreateGuildBanParams>,
    options?: O
  ) => Response<any>
  /** Create a new channel object for the guild. Requires the MANAGE_CHANNELS permission. If setting permission overwrites, only permissions your bot has in the guild can be allowed/denied. Setting MANAGE_ROLES permission in channels is only possible for guild administrators. Returns the new channel object on success. Fires a Channel Create Gateway event. */
  createGuildChannel: (
    guildId: string,
    params?: Partial<CreateGuildChannelParams>,
    options?: O
  ) => Response<Channel>
  /** Create a new emoji for the guild. Requires the MANAGE_EMOJIS_AND_STICKERS permission. Returns the new emoji object on success. Fires a Guild Emojis Update Gateway event. */
  createGuildEmoji: (
    guildId: string,
    params?: Partial<CreateGuildEmojiParams>,
    options?: O
  ) => Response<Emoji>
  /** Create a new guild based on a template. Returns a guild object on success. Fires a Guild Create Gateway event. */
  createGuildFromGuildTemplate: (
    templateCode: string,
    params?: Partial<CreateGuildFromGuildTemplateParams>,
    options?: O
  ) => Response<Guild>
  /** Create a new role for the guild. Requires the MANAGE_ROLES permission. Returns the new role object on success. Fires a Guild Role Create Gateway event. All JSON params are optional. */
  createGuildRole: (
    guildId: string,
    params?: Partial<CreateGuildRoleParams>,
    options?: O
  ) => Response<Role>
  /** Create a guild scheduled event in the guild. Returns a guild scheduled event object on success. */
  createGuildScheduledEvent: (
    guildId: string,
    params?: Partial<CreateGuildScheduledEventParams>,
    options?: O
  ) => Response<GuildScheduledEvent>
  /** Create a new sticker for the guild. Send a multipart/form-data body. Requires the MANAGE_EMOJIS_AND_STICKERS permission. Returns the new sticker object on success. */
  createGuildSticker: (
    guildId: string,
    params?: Partial<CreateGuildStickerParams>,
    options?: O
  ) => Response<Sticker>
  /** Creates a template for the guild. Requires the MANAGE_GUILD permission. Returns the created guild template object on success. */
  createGuildTemplate: (
    guildId: string,
    params?: Partial<CreateGuildTemplateParams>,
    options?: O
  ) => Response<GuildTemplate>
  /** Create a response to an Interaction from the gateway. Body is an interaction response. Returns 204 No Content. */
  createInteractionResponse: (
    interactionId: string,
    interactionToken: string,
    params?: Partial<InteractionResponse>,
    options?: O
  ) => Response<any>
  createMessage: (
    channelId: string,
    params?: Partial<CreateMessageParams>,
    options?: O
  ) => Response<Message>
  /** Create a reaction for the message. This endpoint requires the 'READ_MESSAGE_HISTORY' permission to be present on the current user. Additionally, if nobody else has reacted to the message using this emoji, this endpoint requires the 'ADD_REACTIONS' permission to be present on the current user. Returns a 204 empty response on success.
The emoji must be URL Encoded or the request will fail with 10014: Unknown Emoji. To use custom emoji, you must encode it in the format name:id with the emoji name and emoji id. */
  createReaction: (
    channelId: string,
    messageId: string,
    emoji: string,
    options?: O
  ) => Response<any>
  /** Creates a new Stage instance associated to a Stage channel. Returns that Stage instance. */
  createStageInstance: (
    params?: Partial<CreateStageInstanceParams>,
    options?: O
  ) => Response<StageInstance>
  /** Creates a new webhook and returns a webhook object on success. Requires the MANAGE_WEBHOOKS permission. */
  createWebhook: (
    channelId: string,
    params?: Partial<CreateWebhookParams>,
    options?: O
  ) => Response<Webhook>
  /** Crosspost a message in a News Channel to following channels. This endpoint requires the 'SEND_MESSAGES' permission, if the current user sent the message, or additionally the 'MANAGE_MESSAGES' permission, for all other messages, to be present for the current user. */
  crosspostMessage: (
    channelId: string,
    messageId: string,
    options?: O
  ) => Response<Message>
  /** Deletes all reactions on a message. This endpoint requires the 'MANAGE_MESSAGES' permission to be present on the current user. Fires a Message Reaction Remove All Gateway event. */
  deleteAllReactions: (
    channelId: string,
    messageId: string,
    options?: O
  ) => Response<any>
  /** Deletes all the reactions for a given emoji on a message. This endpoint requires the MANAGE_MESSAGES permission to be present on the current user. Fires a Message Reaction Remove Emoji Gateway event.
The emoji must be URL Encoded or the request will fail with 10014: Unknown Emoji. To use custom emoji, you must encode it in the format name:id with the emoji name and emoji id. */
  deleteAllReactionsForEmoji: (
    channelId: string,
    messageId: string,
    emoji: string,
    options?: O
  ) => Response<any>
  /** Delete a channel permission overwrite for a user or role in a channel. Only usable for guild channels. Requires the MANAGE_ROLES permission. Returns a 204 empty response on success. For more information about permissions, see permissions */
  deleteChannelPermission: (
    channelId: string,
    overwriteId: string,
    options?: O
  ) => Response<any>
  /** Delete a channel, or close a private message. Requires the MANAGE_CHANNELS permission for the guild, or MANAGE_THREADS if the channel is a thread. Deleting a category does not delete its child channels; they will have their parent_id removed and a Channel Update Gateway event will fire for each of them. Returns a channel object on success. Fires a Channel Delete Gateway event (or Thread Delete if the channel was a thread). */
  deletecloseChannel: (channelId: string, options?: O) => Response<Channel>
  /** Deletes a followup message for an Interaction. Returns 204 No Content on success. Does not support ephemeral followups. */
  deleteFollowupMessage: (
    applicationId: string,
    interactionToken: string,
    messageId: string,
    options?: O
  ) => Response<any>
  /** Deletes a global command. Returns 204 No Content on success. */
  deleteGlobalApplicationCommand: (
    applicationId: string,
    commandId: string,
    options?: O
  ) => Response<any>
  /** Delete a guild permanently. User must be owner. Returns 204 No Content on success. Fires a Guild Delete Gateway event. */
  deleteGuild: (guildId: string, options?: O) => Response<any>
  /** Delete a guild command. Returns 204 No Content on success. */
  deleteGuildApplicationCommand: (
    applicationId: string,
    guildId: string,
    commandId: string,
    options?: O
  ) => Response<any>
  /** Delete the given emoji. Requires the MANAGE_EMOJIS_AND_STICKERS permission. Returns 204 No Content on success. Fires a Guild Emojis Update Gateway event. */
  deleteGuildEmoji: (
    guildId: string,
    emojiId: string,
    options?: O
  ) => Response<any>
  /** Delete the attached integration object for the guild. Deletes any associated webhooks and kicks the associated bot if there is one. Requires the MANAGE_GUILD permission. Returns a 204 empty response on success. Fires a Guild Integrations Update Gateway event. */
  deleteGuildIntegration: (
    guildId: string,
    integrationId: string,
    options?: O
  ) => Response<any>
  /** Delete a guild role. Requires the MANAGE_ROLES permission. Returns a 204 empty response on success. Fires a Guild Role Delete Gateway event. */
  deleteGuildRole: (
    guildId: string,
    roleId: string,
    options?: O
  ) => Response<any>
  /** Delete a guild scheduled event. Returns a 204 on success. */
  deleteGuildScheduledEvent: (
    guildId: string,
    guildScheduledEventId: string,
    options?: O
  ) => Response<any>
  /** Delete the given sticker. Requires the MANAGE_EMOJIS_AND_STICKERS permission. Returns 204 No Content on success. */
  deleteGuildSticker: (
    guildId: string,
    stickerId: string,
    options?: O
  ) => Response<any>
  /** Deletes the template. Requires the MANAGE_GUILD permission. Returns the deleted guild template object on success. */
  deleteGuildTemplate: (
    guildId: string,
    templateCode: string,
    options?: O
  ) => Response<GuildTemplate>
  /** Delete an invite. Requires the MANAGE_CHANNELS permission on the channel this invite belongs to, or MANAGE_GUILD to remove any invite across the guild. Returns an invite object on success. Fires a Invite Delete Gateway event. */
  deleteInvite: (inviteCode: string, options?: O) => Response<Invite>
  /** Delete a message. If operating on a guild channel and trying to delete a message that was not sent by the current user, this endpoint requires the MANAGE_MESSAGES permission. Returns a 204 empty response on success. Fires a Message Delete Gateway event. */
  deleteMessage: (
    channelId: string,
    messageId: string,
    options?: O
  ) => Response<any>
  /** Deletes the initial Interaction response. Returns 204 No Content on success. Does not support ephemeral followups. */
  deleteOriginalInteractionResponse: (
    applicationId: string,
    interactionToken: string,
    options?: O
  ) => Response<any>
  /** Delete a reaction the current user has made for the message. Returns a 204 empty response on success.
The emoji must be URL Encoded or the request will fail with 10014: Unknown Emoji. To use custom emoji, you must encode it in the format name:id with the emoji name and emoji id. */
  deleteOwnReaction: (
    channelId: string,
    messageId: string,
    emoji: string,
    options?: O
  ) => Response<any>
  /** Deletes the Stage instance. Returns 204 No Content. */
  deleteStageInstance: (channelId: string, options?: O) => Response<any>
  /** Deletes another user's reaction. This endpoint requires the 'MANAGE_MESSAGES' permission to be present on the current user. Returns a 204 empty response on success.
The emoji must be URL Encoded or the request will fail with 10014: Unknown Emoji. To use custom emoji, you must encode it in the format name:id with the emoji name and emoji id. */
  deleteUserReaction: (
    channelId: string,
    messageId: string,
    emoji: string,
    userId: string,
    options?: O
  ) => Response<any>
  /** Delete a webhook permanently. Requires the MANAGE_WEBHOOKS permission. Returns a 204 No Content response on success. */
  deleteWebhook: (webhookId: string, options?: O) => Response<any>
  /** Deletes a message that was created by the webhook. Returns a 204 No Content response on success. */
  deleteWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    messageId: string,
    params?: Partial<DeleteWebhookMessageParams>,
    options?: O
  ) => Response<any>
  /** Same as above, except this call does not require authentication. */
  deleteWebhookWithToken: (
    webhookId: string,
    webhookToken: string,
    options?: O
  ) => Response<any>
  editApplicationCommandPermissions: (
    applicationId: string,
    guildId: string,
    commandId: string,
    params?: Partial<EditApplicationCommandPermissionParams>,
    options?: O
  ) => Response<GuildApplicationCommandPermission>
  /** Edit the channel permission overwrites for a user or role in a channel. Only usable for guild channels. Requires the MANAGE_ROLES permission. Only permissions your bot has in the guild or channel can be allowed/denied (unless your bot has a MANAGE_ROLES overwrite in the channel). Returns a 204 empty response on success. For more information about permissions, see permissions. */
  editChannelPermissions: (
    channelId: string,
    overwriteId: string,
    params?: Partial<EditChannelPermissionParams>,
    options?: O
  ) => Response<any>
  /** Edits a followup message for an Interaction. Functions the same as Edit Webhook Message. Does not support ephemeral followups. */
  editFollowupMessage: (
    applicationId: string,
    interactionToken: string,
    messageId: string,
    options?: O
  ) => Response<any>
  editGlobalApplicationCommand: (
    applicationId: string,
    commandId: string,
    params?: Partial<EditGlobalApplicationCommandParams>,
    options?: O
  ) => Response<ApplicationCommand>
  editGuildApplicationCommand: (
    applicationId: string,
    guildId: string,
    commandId: string,
    params?: Partial<EditGuildApplicationCommandParams>,
    options?: O
  ) => Response<ApplicationCommand>
  /** Edit a previously sent message. The fields content, embeds, and flags can be edited by the original message author. Other users can only edit flags and only if they have the MANAGE_MESSAGES permission in the corresponding channel. When specifying flags, ensure to include all previously set flags/bits in addition to ones that you are modifying. Only flags documented in the table below may be modified by users (unsupported flag changes are currently ignored without error). */
  editMessage: (
    channelId: string,
    messageId: string,
    params?: Partial<EditMessageParams>,
    options?: O
  ) => Response<Message>
  /** Edits the initial Interaction response. Functions the same as Edit Webhook Message. */
  editOriginalInteractionResponse: (
    applicationId: string,
    interactionToken: string,
    options?: O
  ) => Response<any>
  /** Edits a previously-sent webhook message from the same token. Returns a message object on success. */
  editWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    messageId: string,
    params?: Partial<EditWebhookMessageParams>,
    options?: O
  ) => Response<Message>
  /** Add a new webhook to your GitHub repo (in the repo's settings), and use this endpoint as the "Payload URL." You can choose what events your Discord channel receives by choosing the "Let me select individual events" option and selecting individual events for the new webhook you're configuring. */
  executeGitHubCompatibleWebhook: (
    webhookId: string,
    webhookToken: string,
    options?: O
  ) => Response<any>
  /** Refer to Slack's documentation for more information. We do not support Slack's channel, icon_emoji, mrkdwn, or mrkdwn_in properties. */
  executeSlackCompatibleWebhook: (
    webhookId: string,
    webhookToken: string,
    options?: O
  ) => Response<any>
  /** Refer to Uploading Files for details on attachments and multipart/form-data requests. Returns a message or 204 No Content depending on the wait query parameter. */
  executeWebhook: (
    webhookId: string,
    webhookToken: string,
    params?: Partial<ExecuteWebhookParams>,
    options?: O
  ) => Response<any>
  /** Follow a News Channel to send messages to a target channel. Requires the MANAGE_WEBHOOKS permission in the target channel. Returns a followed channel object. */
  followNewsChannel: (
    channelId: string,
    params?: Partial<FollowNewsChannelParams>,
    options?: O
  ) => Response<FollowedChannel>
  /** Fetches command permissions for a specific command for your application in a guild. Returns a guild application command permissions object. */
  getApplicationCommandPermissions: (
    applicationId: string,
    guildId: string,
    commandId: string,
    options?: O
  ) => Response<GuildApplicationCommandPermission>
  /** Get a channel by ID. Returns a channel object.  If the channel is a thread, a thread member object is included in the returned result. */
  getChannel: (channelId: string, options?: O) => Response<Channel>
  /** Returns a list of invite objects (with invite metadata) for the channel. Only usable for guild channels. Requires the MANAGE_CHANNELS permission. */
  getChannelInvites: (channelId: string, options?: O) => Response<Invite[]>
  /** Returns a specific message in the channel. If operating on a guild channel, this endpoint requires the 'READ_MESSAGE_HISTORY' permission to be present on the current user. Returns a message object on success. */
  getChannelMessage: (
    channelId: string,
    messageId: string,
    options?: O
  ) => Response<Message>
  /** Returns the messages for a channel. If operating on a guild channel, this endpoint requires the VIEW_CHANNEL permission to be present on the current user. If the current user is missing the 'READ_MESSAGE_HISTORY' permission in the channel then this will return no messages (since they cannot read the message history). Returns an array of message objects on success. */
  getChannelMessages: (
    channelId: string,
    params?: Partial<GetChannelMessageParams>,
    options?: O
  ) => Response<Message[]>
  /** Returns a list of channel webhook objects. Requires the MANAGE_WEBHOOKS permission. */
  getChannelWebhooks: (channelId: string, options?: O) => Response<Webhook[]>
  /** Returns the user object of the requester's account. For OAuth2, this requires the identify scope, which will return the object without an email, and optionally the email scope, which returns the object with an email. */
  getCurrentUser: (options?: O) => Response<User>
  /** Returns a guild member object for the current user. Requires the guilds.members.read OAuth2 scope. */
  getCurrentUserGuildMember: (
    guildId: string,
    options?: O
  ) => Response<GuildMember>
  /** Returns a list of partial guild objects the current user is a member of. Requires the guilds OAuth2 scope. */
  getCurrentUserGuilds: (
    params?: Partial<GetCurrentUserGuildParams>,
    options?: O
  ) => Response<Guild[]>
  /** Returns a followup message for an Interaction. Functions the same as Get Webhook Message. Does not support ephemeral followups. */
  getFollowupMessage: (
    applicationId: string,
    interactionToken: string,
    messageId: string,
    options?: O
  ) => Response<any>
  getGateway: (options?: O) => Response<any>
  getGatewayBot: (options?: O) => Response<GetGatewayBotResponse>
  /** Fetch a global command for your application. Returns an application command object. */
  getGlobalApplicationCommand: (
    applicationId: string,
    commandId: string,
    options?: O
  ) => Response<ApplicationCommand>
  /** Fetch all of the global commands for your application. Returns an array of application command objects. */
  getGlobalApplicationCommands: (
    applicationId: string,
    options?: O
  ) => Response<ApplicationCommand[]>
  /** Returns the guild object for the given id. If with_counts is set to true, this endpoint will also return approximate_member_count and approximate_presence_count for the guild. */
  getGuild: (
    guildId: string,
    params?: Partial<GetGuildParams>,
    options?: O
  ) => Response<Guild>
  /** Fetch a guild command for your application. Returns an application command object. */
  getGuildApplicationCommand: (
    applicationId: string,
    guildId: string,
    commandId: string,
    options?: O
  ) => Response<ApplicationCommand>
  /** Fetches command permissions for all commands for your application in a guild. Returns an array of guild application command permissions objects. */
  getGuildApplicationCommandPermissions: (
    applicationId: string,
    guildId: string,
    options?: O
  ) => Response<GuildApplicationCommandPermission[]>
  /** Fetch all of the guild commands for your application for a specific guild. Returns an array of application command objects. */
  getGuildApplicationCommands: (
    applicationId: string,
    guildId: string,
    options?: O
  ) => Response<ApplicationCommand[]>
  /** Returns an audit log object for the guild. Requires the 'VIEW_AUDIT_LOG' permission. */
  getGuildAuditLog: (
    guildId: string,
    params?: Partial<GetGuildAuditLogParams>,
    options?: O
  ) => Response<AuditLog>
  /** Returns a ban object for the given user or a 404 not found if the ban cannot be found. Requires the BAN_MEMBERS permission. */
  getGuildBan: (guildId: string, userId: string, options?: O) => Response<Ban>
  /** Returns a list of ban objects for the users banned from this guild. Requires the BAN_MEMBERS permission. */
  getGuildBans: (guildId: string, options?: O) => Response<Ban[]>
  /** Returns a list of guild channel objects. Does not include threads. */
  getGuildChannels: (guildId: string, options?: O) => Response<Channel[]>
  /** Returns an emoji object for the given guild and emoji IDs. */
  getGuildEmoji: (
    guildId: string,
    emojiId: string,
    options?: O
  ) => Response<Emoji>
  /** Returns a list of integration objects for the guild. Requires the MANAGE_GUILD permission. */
  getGuildIntegrations: (
    guildId: string,
    options?: O
  ) => Response<Integration[]>
  /** Returns a list of invite objects (with invite metadata) for the guild. Requires the MANAGE_GUILD permission. */
  getGuildInvites: (guildId: string, options?: O) => Response<Invite[]>
  /** Returns a guild member object for the specified user. */
  getGuildMember: (
    guildId: string,
    userId: string,
    options?: O
  ) => Response<GuildMember>
  /** Returns the guild preview object for the given id. If the user is not in the guild, then the guild must be lurkable. */
  getGuildPreview: (guildId: string, options?: O) => Response<GuildPreview>
  /** Returns an object with one 'pruned' key indicating the number of members that would be removed in a prune operation. Requires the KICK_MEMBERS permission. */
  getGuildPruneCount: (
    guildId: string,
    params?: Partial<GetGuildPruneCountParams>,
    options?: O
  ) => Response<any>
  /** Returns a list of role objects for the guild. */
  getGuildRoles: (guildId: string, options?: O) => Response<Role[]>
  /** Get a guild scheduled event. Returns a guild scheduled event object on success. */
  getGuildScheduledEvent: (
    guildId: string,
    guildScheduledEventId: string,
    params?: Partial<GetGuildScheduledEventParams>,
    options?: O
  ) => Response<GuildScheduledEvent>
  /** Get a list of guild scheduled event users subscribed to a guild scheduled event. Returns a list of guild scheduled event user objects on success. Guild member data, if it exists, is included if the with_member query parameter is set. */
  getGuildScheduledEventUsers: (
    guildId: string,
    guildScheduledEventId: string,
    params?: Partial<GetGuildScheduledEventUserParams>,
    options?: O
  ) => Response<GuildScheduledEventUser[]>
  /** Returns a sticker object for the given guild and sticker IDs. Includes the user field if the bot has the MANAGE_EMOJIS_AND_STICKERS permission. */
  getGuildSticker: (
    guildId: string,
    stickerId: string,
    options?: O
  ) => Response<Sticker>
  /** Returns a guild template object for the given code. */
  getGuildTemplate: (
    templateCode: string,
    options?: O
  ) => Response<GuildTemplate>
  /** Returns an array of guild template objects. Requires the MANAGE_GUILD permission. */
  getGuildTemplates: (guildId: string, options?: O) => Response<GuildTemplate[]>
  /** Returns a partial invite object for guilds with that feature enabled. Requires the MANAGE_GUILD permission. code will be null if a vanity url for the guild is not set. */
  getGuildVanityUrl: (guildId: string, options?: O) => Response<Invite>
  /** Returns a list of voice region objects for the guild. Unlike the similar /voice route, this returns VIP servers when the guild is VIP-enabled. */
  getGuildVoiceRegions: (
    guildId: string,
    options?: O
  ) => Response<VoiceRegion[]>
  /** Returns a list of guild webhook objects. Requires the MANAGE_WEBHOOKS permission. */
  getGuildWebhooks: (guildId: string, options?: O) => Response<Webhook[]>
  /** Returns the Welcome Screen object for the guild. If the welcome screen is not enabled, the MANAGE_GUILD permission is required. */
  getGuildWelcomeScreen: (
    guildId: string,
    options?: O
  ) => Response<WelcomeScreen>
  /** Returns the widget for the guild. */
  getGuildWidget: (guildId: string, options?: O) => Response<GetGuildWidget>
  /** Returns a PNG image widget for the guild. Requires no permissions or authentication. */
  getGuildWidgetImage: (
    guildId: string,
    params?: Partial<GetGuildWidgetImageParams>,
    options?: O
  ) => Response<any>
  /** Returns a guild widget settings object. Requires the MANAGE_GUILD permission. */
  getGuildWidgetSettings: (
    guildId: string,
    options?: O
  ) => Response<GuildWidgetSetting>
  /** Returns an invite object for the given code. */
  getInvite: (
    inviteCode: string,
    params?: Partial<GetInviteParams>,
    options?: O
  ) => Response<Invite>
  /** Returns the initial Interaction response. Functions the same as Get Webhook Message. */
  getOriginalInteractionResponse: (
    applicationId: string,
    interactionToken: string,
    options?: O
  ) => Response<any>
  /** Returns all pinned messages in the channel as an array of message objects. */
  getPinnedMessages: (channelId: string, options?: O) => Response<Message[]>
  /** Get a list of users that reacted with this emoji. Returns an array of user objects on success.
The emoji must be URL Encoded or the request will fail with 10014: Unknown Emoji. To use custom emoji, you must encode it in the format name:id with the emoji name and emoji id. */
  getReactions: (
    channelId: string,
    messageId: string,
    emoji: string,
    params?: Partial<GetReactionParams>,
    options?: O
  ) => Response<User[]>
  /** Gets the stage instance associated with the Stage channel, if it exists. */
  getStageInstance: (channelId: string, options?: O) => Response<any>
  /** Returns a sticker object for the given sticker ID. */
  getSticker: (stickerId: string, options?: O) => Response<Sticker>
  /** Returns a thread member object for the specified user if they are a member of the thread, returns a 404 response otherwise. */
  getThreadMember: (
    channelId: string,
    userId: string,
    options?: O
  ) => Response<ThreadMember>
  /** Returns a user object for a given user ID. */
  getUser: (userId: string, options?: O) => Response<User>
  /** Returns a list of connection objects. Requires the connections OAuth2 scope. */
  getUserConnections: (options?: O) => Response<Connection[]>
  /** Returns the new webhook object for the given id. */
  getWebhook: (webhookId: string, options?: O) => Response<Webhook>
  /** Returns a previously-sent webhook message from the same token. Returns a message object on success. */
  getWebhookMessage: (
    webhookId: string,
    webhookToken: string,
    messageId: string,
    params?: Partial<GetWebhookMessageParams>,
    options?: O
  ) => Response<Message>
  /** Same as above, except this call does not require authentication and returns no user in the webhook object. */
  getWebhookWithToken: (
    webhookId: string,
    webhookToken: string,
    options?: O
  ) => Response<any>
  /** Adds a recipient to a Group DM using their access token. */
  groupDmAddRecipient: (
    channelId: string,
    userId: string,
    params?: Partial<GroupDmAddRecipientParams>,
    options?: O
  ) => Response<any>
  /** Removes a recipient from a Group DM. */
  groupDmRemoveRecipient: (
    channelId: string,
    userId: string,
    options?: O
  ) => Response<any>
  /** Adds the current user to a thread. Also requires the thread is not archived. Returns a 204 empty response on success. Fires a Thread Members Update Gateway event. */
  joinThread: (channelId: string, options?: O) => Response<any>
  /** Leave a guild. Returns a 204 empty response on success. */
  leaveGuild: (guildId: string, options?: O) => Response<any>
  /** Removes the current user from a thread. Also requires the thread is not archived. Returns a 204 empty response on success. Fires a Thread Members Update Gateway event. */
  leaveThread: (channelId: string, options?: O) => Response<any>
  /** Returns all active threads in the channel, including public and private threads. Threads are ordered by their id, in descending order. */
  listActiveThreads: (
    channelId: string,
    options?: O
  ) => Response<ListActiveThreadResponse>
  /** Returns all active threads in the guild, including public and private threads. Threads are ordered by their id, in descending order. */
  listGuildActiveThreads: (
    guildId: string,
    options?: O
  ) => Response<ListGuildActiveThreadResponse>
  /** Returns a list of emoji objects for the given guild. */
  listGuildEmojis: (guildId: string, options?: O) => Response<Emoji[]>
  /** Returns a list of guild member objects that are members of the guild. */
  listGuildMembers: (
    guildId: string,
    params?: Partial<ListGuildMemberParams>,
    options?: O
  ) => Response<GuildMember[]>
  /** Returns an array of sticker objects for the given guild. Includes user fields if the bot has the MANAGE_EMOJIS_AND_STICKERS permission. */
  listGuildStickers: (guildId: string, options?: O) => Response<Sticker[]>
  /** Returns archived threads in the channel that are of type GUILD_PRIVATE_THREAD, and the user has joined. Threads are ordered by their id, in descending order. Requires the READ_MESSAGE_HISTORY permission. */
  listJoinedPrivateArchivedThreads: (
    channelId: string,
    params?: Partial<ListJoinedPrivateArchivedThreadParams>,
    options?: O
  ) => Response<ListJoinedPrivateArchivedThreadResponse>
  /** Returns the list of sticker packs available to Nitro subscribers. */
  listNitroStickerPacks: (options?: O) => Response<any>
  /** Returns archived threads in the channel that are of type GUILD_PRIVATE_THREAD. Threads are ordered by archive_timestamp, in descending order. Requires both the READ_MESSAGE_HISTORY and MANAGE_THREADS permissions. */
  listPrivateArchivedThreads: (
    channelId: string,
    params?: Partial<ListPrivateArchivedThreadParams>,
    options?: O
  ) => Response<ListPrivateArchivedThreadResponse>
  /** Returns archived threads in the channel that are public. When called on a GUILD_TEXT channel, returns threads of type GUILD_PUBLIC_THREAD. When called on a GUILD_NEWS channel returns threads of type GUILD_NEWS_THREAD. Threads are ordered by archive_timestamp, in descending order. Requires the READ_MESSAGE_HISTORY permission. */
  listPublicArchivedThreads: (
    channelId: string,
    params?: Partial<ListPublicArchivedThreadParams>,
    options?: O
  ) => Response<ListPublicArchivedThreadResponse>
  /** Returns a list of guild scheduled event objects for the given guild. */
  listScheduledEventsForGuild: (
    guildId: string,
    params?: Partial<ListScheduledEventsForGuildParams>,
    options?: O
  ) => Response<GuildScheduledEvent[]>
  /** Returns array of thread members objects that are members of the thread. */
  listThreadMembers: (
    channelId: string,
    options?: O
  ) => Response<ThreadMember[]>
  /** Returns an array of voice region objects that can be used when setting a voice or stage channel's rtc_region. */
  listVoiceRegions: (options?: O) => Response<VoiceRegion[]>
  /** Update a channel's settings. Returns a channel on success, and a 400 BAD REQUEST on invalid parameters. All JSON parameters are optional. */
  modifyChannel: (
    channelId: string,
    params?: Partial<ModifyChannelParams>,
    options?: O
  ) => Response<Channel>
  /** Modifies the current member in a guild. Returns a 200 with the updated member object on success. Fires a Guild Member Update Gateway event. */
  modifyCurrentMember: (
    guildId: string,
    params?: Partial<ModifyCurrentMemberParams>,
    options?: O
  ) => Response<any>
  /** Modify the requester's user account settings. Returns a user object on success. */
  modifyCurrentUser: (
    params?: Partial<ModifyCurrentUserParams>,
    options?: O
  ) => Response<User>
  modifyCurrentUserNick: (
    guildId: string,
    params?: Partial<ModifyCurrentUserNickParams>,
    options?: O
  ) => Response<any>
  /** Updates the current user's voice state. Returns 204 No Content on success. */
  modifyCurrentUserVoiceState: (
    guildId: string,
    params?: Partial<ModifyCurrentUserVoiceStateParams>,
    options?: O
  ) => Response<any>
  /** Modify a guild's settings. Requires the MANAGE_GUILD permission. Returns the updated guild object on success. Fires a Guild Update Gateway event. */
  modifyGuild: (
    guildId: string,
    params?: Partial<ModifyGuildParams>,
    options?: O
  ) => Response<Guild>
  /** Modify the positions of a set of channel objects for the guild. Requires MANAGE_CHANNELS permission. Returns a 204 empty response on success. Fires multiple Channel Update Gateway events. */
  modifyGuildChannelPositions: (
    guildId: string,
    params?: Partial<ModifyGuildChannelPositionParams>,
    options?: O
  ) => Response<any>
  /** Modify the given emoji. Requires the MANAGE_EMOJIS_AND_STICKERS permission. Returns the updated emoji object on success. Fires a Guild Emojis Update Gateway event. */
  modifyGuildEmoji: (
    guildId: string,
    emojiId: string,
    params?: Partial<ModifyGuildEmojiParams>,
    options?: O
  ) => Response<Emoji>
  /** Modify attributes of a guild member. Returns a 200 OK with the guild member as the body. Fires a Guild Member Update Gateway event. If the channel_id is set to null, this will force the target user to be disconnected from voice. */
  modifyGuildMember: (
    guildId: string,
    userId: string,
    params?: Partial<ModifyGuildMemberParams>,
    options?: O
  ) => Response<GuildMember>
  /** Modify a guild role. Requires the MANAGE_ROLES permission. Returns the updated role on success. Fires a Guild Role Update Gateway event. */
  modifyGuildRole: (
    guildId: string,
    roleId: string,
    params?: Partial<ModifyGuildRoleParams>,
    options?: O
  ) => Response<Role>
  /** Modify the positions of a set of role objects for the guild. Requires the MANAGE_ROLES permission. Returns a list of all of the guild's role objects on success. Fires multiple Guild Role Update Gateway events. */
  modifyGuildRolePositions: (
    guildId: string,
    params?: Partial<ModifyGuildRolePositionParams>,
    options?: O
  ) => Response<Role[]>
  /** Modify a guild scheduled event. Returns the modified guild scheduled event object on success. */
  modifyGuildScheduledEvent: (
    guildId: string,
    guildScheduledEventId: string,
    params?: Partial<ModifyGuildScheduledEventParams>,
    options?: O
  ) => Response<GuildScheduledEvent>
  /** Modify the given sticker. Requires the MANAGE_EMOJIS_AND_STICKERS permission. Returns the updated sticker object on success. */
  modifyGuildSticker: (
    guildId: string,
    stickerId: string,
    params?: Partial<ModifyGuildStickerParams>,
    options?: O
  ) => Response<Sticker>
  /** Modifies the template's metadata. Requires the MANAGE_GUILD permission. Returns the guild template object on success. */
  modifyGuildTemplate: (
    guildId: string,
    templateCode: string,
    params?: Partial<ModifyGuildTemplateParams>,
    options?: O
  ) => Response<GuildTemplate>
  /** Modify the guild's Welcome Screen. Requires the MANAGE_GUILD permission. Returns the updated Welcome Screen object. */
  modifyGuildWelcomeScreen: (
    guildId: string,
    params?: Partial<ModifyGuildWelcomeScreenParams>,
    options?: O
  ) => Response<WelcomeScreen>
  /** Modify a guild widget settings object for the guild. All attributes may be passed in with JSON and modified. Requires the MANAGE_GUILD permission. Returns the updated guild widget object. */
  modifyGuildWidget: (
    guildId: string,
    options?: O
  ) => Response<GuildWidgetSetting>
  /** Updates fields of an existing Stage instance. Returns the updated Stage instance. */
  modifyStageInstance: (
    channelId: string,
    params?: Partial<ModifyStageInstanceParams>,
    options?: O
  ) => Response<StageInstance>
  /** Updates another user's voice state. */
  modifyUserVoiceState: (
    guildId: string,
    userId: string,
    params?: Partial<ModifyUserVoiceStateParams>,
    options?: O
  ) => Response<any>
  /** Modify a webhook. Requires the MANAGE_WEBHOOKS permission. Returns the updated webhook object on success. */
  modifyWebhook: (
    webhookId: string,
    params?: Partial<ModifyWebhookParams>,
    options?: O
  ) => Response<Webhook>
  /** Same as above, except this call does not require authentication, does not accept a channel_id parameter in the body, and does not return a user in the webhook object. */
  modifyWebhookWithToken: (
    webhookId: string,
    webhookToken: string,
    options?: O
  ) => Response<any>
  /** Pin a message in a channel. Requires the MANAGE_MESSAGES permission. Returns a 204 empty response on success. */
  pinMessage: (
    channelId: string,
    messageId: string,
    options?: O
  ) => Response<any>
  /** Remove the ban for a user. Requires the BAN_MEMBERS permissions. Returns a 204 empty response on success. Fires a Guild Ban Remove Gateway event. */
  removeGuildBan: (
    guildId: string,
    userId: string,
    options?: O
  ) => Response<any>
  /** Remove a member from a guild. Requires KICK_MEMBERS permission. Returns a 204 empty response on success. Fires a Guild Member Remove Gateway event. */
  removeGuildMember: (
    guildId: string,
    userId: string,
    options?: O
  ) => Response<any>
  /** Removes a role from a guild member. Requires the MANAGE_ROLES permission. Returns a 204 empty response on success. Fires a Guild Member Update Gateway event. */
  removeGuildMemberRole: (
    guildId: string,
    userId: string,
    roleId: string,
    options?: O
  ) => Response<any>
  /** Removes another member from a thread. Requires the MANAGE_THREADS permission, or the creator of the thread if it is a GUILD_PRIVATE_THREAD. Also requires the thread is not archived. Returns a 204 empty response on success. Fires a Thread Members Update Gateway event. */
  removeThreadMember: (
    channelId: string,
    userId: string,
    options?: O
  ) => Response<any>
  /** Returns a list of guild member objects whose username or nickname starts with a provided string. */
  searchGuildMembers: (
    guildId: string,
    params?: Partial<SearchGuildMemberParams>,
    options?: O
  ) => Response<GuildMember[]>
  /** Creates a new thread from an existing message. Returns a channel on success, and a 400 BAD REQUEST on invalid parameters. Fires a Thread Create Gateway event. */
  startThreadWithMessage: (
    channelId: string,
    messageId: string,
    params?: Partial<StartThreadWithMessageParams>,
    options?: O
  ) => Response<Channel>
  /** Creates a new thread that is not connected to an existing message. The created thread defaults to a GUILD_PRIVATE_THREAD*. Returns a channel on success, and a 400 BAD REQUEST on invalid parameters. Fires a Thread Create Gateway event. */
  startThreadWithoutMessage: (
    channelId: string,
    params?: Partial<StartThreadWithoutMessageParams>,
    options?: O
  ) => Response<Channel>
  /** Syncs the template to the guild's current state. Requires the MANAGE_GUILD permission. Returns the guild template object on success. */
  syncGuildTemplate: (
    guildId: string,
    templateCode: string,
    options?: O
  ) => Response<GuildTemplate>
  /** Post a typing indicator for the specified channel. Generally bots should not implement this route. However, if a bot is responding to a command and expects the computation to take a few seconds, this endpoint may be called to let the user know that the bot is processing their message. Returns a 204 empty response on success. Fires a Typing Start Gateway event. */
  triggerTypingIndicator: (channelId: string, options?: O) => Response<any>
  /** Unpin a message in a channel. Requires the MANAGE_MESSAGES permission. Returns a 204 empty response on success. */
  unpinMessage: (
    channelId: string,
    messageId: string,
    options?: O
  ) => Response<any>
}
export interface ExecuteWebhookParams {
  /** the message contents (up to 2000 characters) */
  content: string
  /** override the default username of the webhook */
  username: string
  /** override the default avatar of the webhook */
  avatar_url: string
  /** true if this is a TTS message */
  tts: boolean
  /** embedded rich content */
  embeds: Embed[]
  /** allowed mentions for the message */
  allowed_mentions: AllowedMention
  /** the components to include with the message */
  components: Component[]
  /** the contents of the file being sent */
  files: string
  /** JSON encoded body of non-file params */
  payload_json: string
  /** attachment objects with filename and description */
  attachments: Attachment[]
  /** message flags combined as a bitfield (only SUPPRESS_EMBEDS can be set) */
  flags: number
}
export enum ExplicitContentFilterLevel {
  /** media content will not be scanned */
  DISABLED = 0,
  /** media content sent by members without roles will be scanned */
  MEMBERS_WITHOUT_ROLES = 1,
  /** media content sent by all members will be scanned */
  ALL_MEMBERS = 2,
}
export interface FollowedChannel {
  /** source channel id */
  channel_id: Snowflake
  /** created target webhook id */
  webhook_id: Snowflake
}
export interface FollowNewsChannelParams {
  /** id of target channel */
  webhook_channel_id: Snowflake
}
export type GatewayCommand =
  | Identify
  | Resume
  | Heartbeat
  | RequestGuildMember
  | UpdateVoiceState
  | UpdatePresence
export interface GatewayCommands {
  IDENTIFY: Identify
  RESUME: Resume
  HEARTBEAT: Heartbeat
  REQUEST_GUILD_MEMBERS: RequestGuildMember
  UPDATE_VOICE_STATE: UpdateVoiceState
  UPDATE_PRESENCE: UpdatePresence
}
export type GatewayEvent =
  | HelloEvent
  | ReadyEvent
  | ResumedEvent
  | ReconnectEvent
  | InvalidSessionEvent
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
  | GuildCreateEvent
  | GuildUpdateEvent
  | GuildDeleteEvent
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
  | StageInstanceDeleteEvent
  | StageInstanceUpdateEvent
  | TypingStartEvent
  | UserUpdateEvent
  | VoiceStateUpdateEvent
  | VoiceServerUpdateEvent
  | WebhooksUpdateEvent
export interface GatewayEvents {
  HELLO: HelloEvent
  READY: ReadyEvent
  RESUMED: ResumedEvent
  RECONNECT: ReconnectEvent
  INVALID_SESSION: InvalidSessionEvent
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
  GUILD_CREATE: GuildCreateEvent
  GUILD_UPDATE: GuildUpdateEvent
  GUILD_DELETE: GuildDeleteEvent
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
  STAGE_INSTANCE_DELETE: StageInstanceDeleteEvent
  STAGE_INSTANCE_UPDATE: StageInstanceUpdateEvent
  TYPING_START: TypingStartEvent
  USER_UPDATE: UserUpdateEvent
  VOICE_STATE_UPDATE: VoiceStateUpdateEvent
  VOICE_SERVER_UPDATE: VoiceServerUpdateEvent
  WEBHOOKS_UPDATE: WebhooksUpdateEvent
}
export const GatewayIntents = {
  GUILDS: 1 << 0,
  GUILD_MEMBERS: 1 << 1,
  GUILD_BANS: 1 << 2,
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
  GUILD_SCHEDULED_EVENTS: 1 << 16,
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
  op: GatewayOpcode
  /** event data */
  d?: T
  /** sequence number, used for resuming sessions and heartbeats */
  s?: number | null
  /** the event name for this payload */
  t?: string | null
}
export interface GetChannelMessageParams {
  /** get messages around this message ID */
  around: Snowflake
  /** get messages before this message ID */
  before: Snowflake
  /** get messages after this message ID */
  after: Snowflake
  /** max number of messages to return (1-100) */
  limit: number
}
export interface GetCurrentUserGuildParams {
  /** get guilds before this guild ID */
  before: Snowflake
  /** get guilds after this guild ID */
  after: Snowflake
  /** max number of guilds to return (1-200) */
  limit: number
}
export interface GetGatewayBotResponse {
  /** The WSS URL that can be used for connecting to the gateway */
  url: string
  /** The recommended number of shards to use when connecting */
  shards: number
  /** Information on the current session start limit */
  session_start_limit: SessionStartLimit
}
export interface GetGuildAuditLogParams {
  /** filter the log for actions made by a user */
  user_id: Snowflake
  /** the type of audit log event */
  action_type: AuditLogEvent
  /** filter the log before a certain entry id */
  before: Snowflake
  /** how many entries are returned (default 50, minimum 1, maximum 100) */
  limit: number
}
export interface GetGuildParams {
  /** when true, will return approximate member and presence counts for the guild */
  with_counts?: boolean
}
export interface GetGuildPruneCountParams {
  /** number of days to count prune for (1-30) */
  days: number
  /** role(s) to include */
  include_roles: Snowflake[]
}
export interface GetGuildScheduledEventParams {
  /** include number of users subscribed to this event */
  with_user_count?: boolean
}
export interface GetGuildScheduledEventUserParams {
  /** number of users to return (up to maximum 100) */
  limit?: Number
  /** include guild member data if it exists */
  with_member?: boolean
  /** consider only users before given user id */
  before?: Snowflake
  /** consider only users after given user id */
  after?: Snowflake
}
export interface GetGuildWidget {
  /** guild id */
  id: Snowflake
  /** guild name (2-100 characters) */
  name: string
  /** instant invite for the guilds specified widget invite channel */
  instant_invite?: string | null
  /** voice and stage channels which are accessible by @everyone */
  channels: Channel[]
  /** special widget user objects that includes users presence (Limit 100) */
  members: User[]
  /** number of online members in this guild */
  presence_count: number
}
export interface GetGuildWidgetImageParams {
  /** style of the widget image returned (see below) */
  style: string
}
export interface GetInviteParams {
  /** whether the invite should contain approximate member counts */
  with_counts?: boolean
  /** whether the invite should contain the expiration date */
  with_expiration?: boolean
  /** the guild scheduled event to include with the invite */
  guild_scheduled_event_id?: Snowflake
}
export interface GetReactionParams {
  /** get users after this user ID */
  after: Snowflake
  /** max number of users to return (1-100) */
  limit: number
}
export interface GetWebhookMessageParams {
  /** id of the thread the message is in */
  thread_id: Snowflake
}
export interface GroupDmAddRecipientParams {
  /** access token of a user that has granted your app the gdm.join scope */
  access_token: string
  /** nickname of the user being added */
  nick: string
}
export interface Guild {
  /** guild id */
  id: Snowflake
  /** guild name (2-100 characters, excluding trailing and leading whitespace) */
  name: string
  /** icon hash */
  icon?: string | null
  /** icon hash, returned when in the template object */
  icon_hash?: string | null
  /** splash hash */
  splash?: string | null
  /** discovery splash hash; only present for guilds with the "DISCOVERABLE" feature */
  discovery_splash?: string | null
  /** true if the user is the owner of the guild */
  owner?: boolean
  /** id of owner */
  owner_id: Snowflake
  /** total permissions for the user in the guild (excludes overwrites) */
  permissions?: string
  /** voice region id for the guild (deprecated) */
  region?: string | null
  /** id of afk channel */
  afk_channel_id?: Snowflake | null
  /** afk timeout in seconds */
  afk_timeout: number
  /** true if the server widget is enabled */
  widget_enabled?: boolean
  /** the channel id that the widget will generate an invite to, or null if set to no invite */
  widget_channel_id?: Snowflake | null
  /** verification level required for the guild */
  verification_level: VerificationLevel
  /** default message notifications level */
  default_message_notifications: DefaultMessageNotificationLevel
  /** explicit content filter level */
  explicit_content_filter: ExplicitContentFilterLevel
  /** roles in the guild */
  roles: Role[]
  /** custom guild emojis */
  emojis: Emoji[]
  /** enabled guild features */
  features: GuildFeature[]
  /** required MFA level for the guild */
  mfa_level: MfaLevel
  /** application id of the guild creator if it is bot-created */
  application_id?: Snowflake | null
  /** the id of the channel where guild notices such as welcome messages and boost events are posted */
  system_channel_id?: Snowflake | null
  /** system channel flags */
  system_channel_flags: number
  /** the id of the channel where Community guilds can display rules and/or guidelines */
  rules_channel_id?: Snowflake | null
  /** when this guild was joined at */
  joined_at?: string
  /** true if this is considered a large guild */
  large?: boolean
  /** true if this guild is unavailable due to an outage */
  unavailable?: boolean
  /** total number of members in this guild */
  member_count?: number
  /** states of members currently in voice channels; lacks the guild_id key */
  voice_states?: VoiceState[]
  /** users in the guild */
  members?: GuildMember[]
  /** channels in the guild */
  channels?: Channel[]
  /** all active threads in the guild that current user has permission to view */
  threads?: Channel[]
  /** presences of the members in the guild, will only include non-offline members if the size is greater than large threshold */
  presences?: PresenceUpdateEvent[]
  /** the maximum number of presences for the guild (null is always returned, apart from the largest of guilds) */
  max_presences?: number | null
  /** the maximum number of members for the guild */
  max_members?: number
  /** the vanity url code for the guild */
  vanity_url_code?: string | null
  /** the description of a Community guild */
  description?: string | null
  /** banner hash */
  banner?: string | null
  /** premium tier (Server Boost level) */
  premium_tier: PremiumTier
  /** the number of boosts this guild currently has */
  premium_subscription_count?: number
  /** the preferred locale of a Community guild; used in server discovery and notices from Discord, and sent in interactions; defaults to "en-US" */
  preferred_locale: string
  /** the id of the channel where admins and moderators of Community guilds receive notices from Discord */
  public_updates_channel_id?: Snowflake | null
  /** the maximum amount of users in a video channel */
  max_video_channel_users?: number
  /** approximate number of members in this guild, returned from the GET /guilds/<id> endpoint when with_counts is true */
  approximate_member_count?: number
  /** approximate number of non-offline members in this guild, returned from the GET /guilds/<id> endpoint when with_counts is true */
  approximate_presence_count?: number
  /** the welcome screen of a Community guild, shown to new members, returned in an Invite's guild object */
  welcome_screen?: WelcomeScreen
  /** guild NSFW level */
  nsfw_level: GuildNsfwLevel
  /** Stage instances in the guild */
  stage_instances?: StageInstance[]
  /** custom guild stickers */
  stickers?: Sticker[]
  /** the scheduled events in the guild */
  guild_scheduled_events?: GuildScheduledEvent[]
  /** whether the guild has the boost progress bar enabled */
  premium_progress_bar_enabled: boolean
}
export interface GuildApplicationCommandPermission {
  /** the id of the command */
  id: Snowflake
  /** the id of the application the command belongs to */
  application_id: Snowflake
  /** the id of the guild */
  guild_id: Snowflake
  /** the permissions for the command in the guild */
  permissions: ApplicationCommandPermission[]
}
export interface GuildBanAddEvent {
  /** id of the guild */
  guild_id: Snowflake
  /** the banned user */
  user: User
}
export interface GuildBanRemoveEvent {
  /** id of the guild */
  guild_id: Snowflake
  /** the unbanned user */
  user: User
}
export type GuildCreateEvent = Guild
export type GuildDeleteEvent = UnavailableGuild
export interface GuildEmojisUpdateEvent {
  /** id of the guild */
  guild_id: Snowflake
  /** array of emojis */
  emojis: Emoji[]
}
export enum GuildFeature {
  /** guild has access to set an animated guild icon */
  ANIMATED_ICON = "ANIMATED_ICON",
  /** guild has access to set a guild banner image */
  BANNER = "BANNER",
  /** guild has access to use commerce features (i.e. create store channels) */
  COMMERCE = "COMMERCE",
  /** guild can enable welcome screen, Membership Screening, stage channels and discovery, and receives community updates */
  COMMUNITY = "COMMUNITY",
  /** guild is able to be discovered in the directory */
  DISCOVERABLE = "DISCOVERABLE",
  /** guild is able to be featured in the directory */
  FEATURABLE = "FEATURABLE",
  /** guild has access to set an invite splash background */
  INVITE_SPLASH = "INVITE_SPLASH",
  /** guild has enabled Membership Screening */
  MEMBER_VERIFICATION_GATE_ENABLED = "MEMBER_VERIFICATION_GATE_ENABLED",
  /** guild has enabled monetization */
  MONETIZATION_ENABLED = "MONETIZATION_ENABLED",
  /** guild has increased custom sticker slots */
  MORE_STICKERS = "MORE_STICKERS",
  /** guild has access to create news channels */
  NEWS = "NEWS",
  /** guild is partnered */
  PARTNERED = "PARTNERED",
  /** guild can be previewed before joining via Membership Screening or the directory */
  PREVIEW_ENABLED = "PREVIEW_ENABLED",
  /** guild has access to create private threads */
  PRIVATE_THREADS = "PRIVATE_THREADS",
  /** guild is able to set role icons */
  ROLE_ICONS = "ROLE_ICONS",
  /** guild has access to the seven day archive time for threads */
  SEVEN_DAY_THREAD_ARCHIVE = "SEVEN_DAY_THREAD_ARCHIVE",
  /** guild has access to the three day archive time for threads */
  THREE_DAY_THREAD_ARCHIVE = "THREE_DAY_THREAD_ARCHIVE",
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
  /** id of the guild whose integrations were updated */
  guild_id: Snowflake
}
export interface GuildMember {
  /** the user this guild member represents */
  user?: User
  /** this user's guild nickname */
  nick?: string | null
  /** the member's guild avatar hash */
  avatar?: string | null
  /** array of role object ids */
  roles: Snowflake[]
  /** when the user joined the guild */
  joined_at: string
  /** when the user started boosting the guild */
  premium_since?: string | null
  /** whether the user is deafened in voice channels */
  deaf: boolean
  /** whether the user is muted in voice channels */
  mute: boolean
  /** whether the user has not yet passed the guild's Membership Screening requirements */
  pending?: boolean
  /** total permissions of the member in the channel, including overwrites, returned when in the interaction object */
  permissions?: string
  /** when the user's timeout will expire and the user will be able to communicate in the guild again, null or a time in the past if the user is not timed out */
  communication_disabled_until?: string | null
}
export type GuildMemberAddEvent = GuildMember & GuildMemberAddExtra
export interface GuildMemberAddExtra {
  /** id of the guild */
  guild_id: Snowflake
}
export interface GuildMemberRemoveEvent {
  /** the id of the guild */
  guild_id: Snowflake
  /** the user who was removed */
  user: User
}
export interface GuildMembersChunkEvent {
  /** the id of the guild */
  guild_id: Snowflake
  /** set of guild members */
  members: GuildMember[]
  /** the chunk index in the expected chunks for this response (0 <= chunk_index < chunk_count) */
  chunk_index: number
  /** the total number of expected chunks for this response */
  chunk_count: number
  /** if passing an invalid id to REQUEST_GUILD_MEMBERS, it will be returned here */
  not_found?: any[]
  /** if passing true to REQUEST_GUILD_MEMBERS, presences of the returned members will be here */
  presences?: PresenceUpdateEvent[]
  /** the nonce used in the Guild Members Request */
  nonce?: string
}
export interface GuildMemberUpdateEvent {
  /** the id of the guild */
  guild_id: Snowflake
  /** user role ids */
  roles: Snowflake[]
  /** the user */
  user: User
  /** nickname of the user in the guild */
  nick?: string | null
  /** the member's guild avatar hash */
  avatar?: string | null
  /** when the user joined the guild */
  joined_at?: string | null
  /** when the user starting boosting the guild */
  premium_since?: string | null
  /** whether the user is deafened in voice channels */
  deaf?: boolean
  /** whether the user is muted in voice channels */
  mute?: boolean
  /** whether the user has not yet passed the guild's Membership Screening requirements */
  pending?: boolean
  /** when the user's timeout will expire and the user will be able to communicate in the guild again, null or a time in the past if the user is not timed out */
  communication_disabled_until?: string | null
}
export enum GuildNsfwLevel {
  DEFAULT = 0,
  EXPLICIT = 1,
  SAFE = 2,
  AGE_RESTRICTED = 3,
}
export interface GuildPreview {
  /** guild id */
  id: Snowflake
  /** guild name (2-100 characters) */
  name: string
  /** icon hash */
  icon?: string | null
  /** splash hash */
  splash?: string | null
  /** discovery splash hash */
  discovery_splash?: string | null
  /** custom guild emojis */
  emojis: Emoji[]
  /** enabled guild features */
  features: GuildFeature[]
  /** approximate number of members in this guild */
  approximate_member_count: number
  /** approximate number of online members in this guild */
  approximate_presence_count: number
  /** the description for the guild, if the guild is discoverable */
  description?: string | null
  /** custom guild stickers */
  stickers: Sticker[]
}
export interface GuildRoleCreateEvent {
  /** the id of the guild */
  guild_id: Snowflake
  /** the role created */
  role: Role
}
export interface GuildRoleDeleteEvent {
  /** id of the guild */
  guild_id: Snowflake
  /** id of the role */
  role_id: Snowflake
}
export interface GuildRoleUpdateEvent {
  /** the id of the guild */
  guild_id: Snowflake
  /** the role updated */
  role: Role
}
export interface GuildScheduledEvent {
  /** the id of the scheduled event */
  id: Snowflake
  /** the guild id which the scheduled event belongs to */
  guild_id: Snowflake
  /** the channel id in which the scheduled event will be hosted, or null if scheduled entity type is EXTERNAL */
  channel_id?: Snowflake | null
  /** the id of the user that created the scheduled event * */
  creator_id?: Snowflake | null
  /** the name of the scheduled event (1-100 characters) */
  name: string
  /** the description of the scheduled event (1-1000 characters) */
  description?: string | null
  /** the time the scheduled event will start */
  scheduled_start_time: string
  /** the time the scheduled event will end, required if entity_type is EXTERNAL */
  scheduled_end_time?: string | null
  /** the privacy level of the scheduled event */
  privacy_level: GuildScheduledEventPrivacyLevel
  /** the status of the scheduled event */
  status: GuildScheduledEventStatus
  /** the type of the scheduled event */
  entity_type: GuildScheduledEventEntityType
  /** the id of an entity associated with a guild scheduled event */
  entity_id?: Snowflake | null
  /** additional metadata for the guild scheduled event */
  entity_metadata?: GuildScheduledEventEntityMetadatum | null
  /** the user that created the scheduled event */
  creator?: User
  /** the number of users subscribed to the scheduled event */
  user_count?: number
  /** the cover image hash of the scheduled event */
  image?: string | null
}
export type GuildScheduledEventCreateEvent = GuildScheduledEvent
export type GuildScheduledEventDeleteEvent = GuildScheduledEvent
export interface GuildScheduledEventEntityMetadatum {
  /** location of the event (1-100 characters) */
  location?: string
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
  guild_scheduled_event_id: Snowflake
  /** user which subscribed to an event */
  user: User
  /** guild member data for this user for the guild which this event belongs to, if any */
  member?: GuildMember
}
export interface GuildScheduledEventUserAddEvent {
  /** id of the guild scheduled event */
  guild_scheduled_event_id: Snowflake
  /** id of the user */
  user_id: Snowflake
  /** id of the guild */
  guild_id: Snowflake
}
export interface GuildScheduledEventUserRemoveEvent {
  /** id of the guild scheduled event */
  guild_scheduled_event_id: Snowflake
  /** id of the user */
  user_id: Snowflake
  /** id of the guild */
  guild_id: Snowflake
}
export interface GuildStickersUpdateEvent {
  /** id of the guild */
  guild_id: Snowflake
  /** array of stickers */
  stickers: Sticker[]
}
export interface GuildTemplate {
  /** the template code (unique ID) */
  code: string
  /** template name */
  name: string
  /** the description for the template */
  description?: string | null
  /** number of times this template has been used */
  usage_count: number
  /** the ID of the user who created the template */
  creator_id: Snowflake
  /** the user who created the template */
  creator: User
  /** when this template was created */
  created_at: string
  /** when this template was last synced to the source guild */
  updated_at: string
  /** the ID of the guild this template is based on */
  source_guild_id: Snowflake
  /** the guild snapshot this template contains */
  serialized_source_guild: Guild
  /** whether the template has unsynced changes */
  is_dirty?: boolean | null
}
export type GuildUpdateEvent = Guild
export interface GuildWidgetSetting {
  /** whether the widget is enabled */
  enabled: boolean
  /** the widget channel id */
  channel_id?: Snowflake | null
}
export type Heartbeat = number | null
export interface HelloEvent {
  /** the interval (in milliseconds) the client should heartbeat with */
  heartbeat_interval: number
}
export interface Identify {
  /** authentication token */
  token: string
  /** connection properties */
  properties: IdentifyConnectionProperty
  /** whether this connection supports compression of packets */
  compress?: boolean
  /** value between 50 and 250, total number of members where the gateway will stop sending offline members in the guild member list */
  large_threshold?: number
  /** used for Guild Sharding */
  shard?: number[]
  /** presence structure for initial presence information */
  presence?: UpdatePresence
  /** the Gateway Intents you wish to receive */
  intents: number
}
export interface IdentifyConnectionProperty {
  /** your operating system */
  $os: string
  /** your library name */
  $browser: string
  /** your library name */
  $device: string
}
export interface Integration {
  /** integration id */
  id: Snowflake
  /** integration name */
  name: string
  /** integration type (twitch, youtube, or discord) */
  type: string
  /** is this integration enabled */
  enabled: boolean
  /** is this integration syncing */
  syncing?: boolean
  /** id that this integration uses for "subscribers" */
  role_id?: Snowflake
  /** whether emoticons should be synced for this integration (twitch only currently) */
  enable_emoticons?: boolean
  /** the behavior of expiring subscribers */
  expire_behavior?: IntegrationExpireBehavior
  /** the grace period (in days) before expiring subscribers */
  expire_grace_period?: number
  /** user for this integration */
  user?: User
  /** integration account information */
  account: IntegrationAccount
  /** when this integration was last synced */
  synced_at?: string
  /** how many subscribers this integration has */
  subscriber_count?: number
  /** has this integration been revoked */
  revoked?: boolean
  /** The bot/OAuth2 application for discord integrations */
  application?: IntegrationApplication
}
export interface IntegrationAccount {
  /** id of the account */
  id: string
  /** name of the account */
  name: string
}
export interface IntegrationApplication {
  /** the id of the app */
  id: Snowflake
  /** the name of the app */
  name: string
  /** the icon hash of the app */
  icon?: string | null
  /** the description of the app */
  description: string
  /** the summary of the app */
  summary: string
  /** the bot associated with this application */
  bot?: User
}
export type IntegrationCreateEvent = Integration &
  IntegrationCreateEventAdditional
export interface IntegrationCreateEventAdditional {
  /** id of the guild */
  guild_id: Snowflake
}
export interface IntegrationDeleteEvent {
  /** integration id */
  id: Snowflake
  /** id of the guild */
  guild_id: Snowflake
  /** id of the bot/OAuth2 application for this discord integration */
  application_id?: Snowflake
}
export enum IntegrationExpireBehavior {
  REMOVE_ROLE = 0,
  KICK = 1,
}
export type IntegrationUpdateEvent = Integration &
  IntegrationUpdateEventAdditional
export interface IntegrationUpdateEventAdditional {
  /** id of the guild */
  guild_id: Snowflake
}
export interface Interaction {
  /** id of the interaction */
  id: Snowflake
  /** id of the application this interaction is for */
  application_id: Snowflake
  /** the type of interaction */
  type: InteractionType
  /** the command data payload */
  data?: InteractionDatum
  /** the guild it was sent from */
  guild_id?: Snowflake
  /** the channel it was sent from */
  channel_id?: Snowflake
  /** guild member data for the invoking user, including permissions */
  member?: GuildMember
  /** user object for the invoking user, if invoked in a DM */
  user?: User
  /** a continuation token for responding to the interaction */
  token: string
  /** read-only property, always 1 */
  version: number
  /** for components, the message they were attached to */
  message?: Message
  /** the selected language of the invoking user */
  locale?: string
  /** the guild's preferred locale, if invoked in a guild */
  guild_locale?: string
}
export interface InteractionCallbackAutocomplete {
  /** autocomplete choices (max of 25 choices) */
  choices: ApplicationCommandOptionChoice[]
}
export type InteractionCallbackDatum =
  | InteractionCallbackAutocomplete
  | InteractionCallbackMessage
  | InteractionCallbackModal
export interface InteractionCallbackMessage {
  /** is the response TTS */
  tts?: boolean
  /** message content */
  content?: string
  /** supports up to 10 embeds */
  embeds?: Embed[]
  /** allowed mentions object */
  allowed_mentions?: AllowedMention
  /** message flags combined as a bitfield (only SUPPRESS_EMBEDS and EPHEMERAL can be set) */
  flags?: number
  /** message components */
  components?: Component[]
  /** attachment objects with filename and description */
  attachments?: Attachment[]
}
export interface InteractionCallbackModal {
  /** a developer-defined identifier for the component, max 100 characters */
  custom_id: string
  /** the title of the popup modal */
  title: string
  /** between 1 and 5 (inclusive) components that make up the modal */
  components: Component[]
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
}
export type InteractionCreateEvent = Interaction
export interface InteractionDatum {
  /** the ID of the invoked command */
  id: Snowflake
  /** the name of the invoked command */
  name: string
  /** the type of the invoked command */
  type: number
  /** converted users + roles + channels + attachments */
  resolved?: ResolvedDatum
  /** the params + values from the user */
  options?: ApplicationCommandInteractionDataOption[]
  /** the custom_id of the component */
  custom_id?: string
  /** the type of the component */
  component_type?: ComponentType
  /** the values the user selected */
  values?: SelectOption[]
  /** id the of user or message targeted by a user or message command */
  target_id?: Snowflake
  /** the values submitted by the user */
  components?: Component[]
}
export interface InteractionResponse {
  /** the type of response */
  type: InteractionCallbackType
  /** an optional response message */
  data?: InteractionCallbackDatum
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
  code: string
  /** the guild this invite is for */
  guild?: Guild
  /** the channel this invite is for */
  channel?: Channel | null
  /** the user who created the invite */
  inviter?: User
  /** the type of target for this voice channel invite */
  target_type?: InviteTargetType
  /** the user whose stream to display for this voice channel stream invite */
  target_user?: User
  /** the embedded application to open for this voice channel embedded application invite */
  target_application?: Application
  /** approximate count of online members, returned from the GET /invites/<code> endpoint when with_counts is true */
  approximate_presence_count?: number
  /** approximate count of total members, returned from the GET /invites/<code> endpoint when with_counts is true */
  approximate_member_count?: number
  /** the expiration date of this invite, returned from the GET /invites/<code> endpoint when with_expiration is true */
  expires_at?: string | null
  /** stage instance data if there is a public Stage instance in the Stage channel this invite is for (deprecated) */
  stage_instance?: InviteStageInstance
  /** guild scheduled event data, only included if guild_scheduled_event_id contains a valid guild scheduled event id */
  guild_scheduled_event?: GuildScheduledEvent
}
export interface InviteCreateEvent {
  /** the channel the invite is for */
  channel_id: Snowflake
  /** the unique invite code */
  code: string
  /** the time at which the invite was created */
  created_at: string
  /** the guild of the invite */
  guild_id?: Snowflake
  /** the user that created the invite */
  inviter?: User
  /** how long the invite is valid for (in seconds) */
  max_age: number
  /** the maximum number of times the invite can be used */
  max_uses: number
  /** the type of target for this voice channel invite */
  target_type?: InviteTargetType
  /** the user whose stream to display for this voice channel stream invite */
  target_user?: User
  /** the embedded application to open for this voice channel embedded application invite */
  target_application?: Application
  /** whether or not the invite is temporary (invited users will be kicked on disconnect unless they're assigned a role) */
  temporary: boolean
  /** how many times the invite has been used (always will be 0) */
  uses: number
}
export interface InviteDeleteEvent {
  /** the channel of the invite */
  channel_id: Snowflake
  /** the guild of the invite */
  guild_id?: Snowflake
  /** the unique invite code */
  code: string
}
export interface InviteMetadatum {
  /** number of times this invite has been used */
  uses: number
  /** max number of times this invite can be used */
  max_uses: number
  /** duration (in seconds) after which the invite expires */
  max_age: number
  /** whether this invite only grants temporary membership */
  temporary: boolean
  /** when this invite was created */
  created_at: string
}
export interface InviteStageInstance {
  /** the members speaking in the Stage */
  members: GuildMember[]
  /** the number of users in the Stage */
  participant_count: number
  /** the number of users speaking in the Stage */
  speaker_count: number
  /** the topic of the Stage instance (1-120 characters) */
  topic: string
}
export enum InviteTargetType {
  STREAM = 1,
  EMBEDDED_APPLICATION = 2,
}
export interface ListActiveThreadResponse {
  /** the active threads */
  threads: Channel[]
  /** a thread member object for each returned thread the current user has joined */
  members: ThreadMember[]
  /** whether there are potentially additional threads that could be returned on a subsequent call */
  has_more: boolean
}
export interface ListGuildActiveThreadResponse {
  /** the active threads */
  threads: Channel[]
  /** a thread member object for each returned thread the current user has joined */
  members: ThreadMember[]
}
export interface ListGuildMemberParams {
  /** max number of members to return (1-1000) */
  limit: number
  /** the highest user id in the previous page */
  after: Snowflake
}
export interface ListJoinedPrivateArchivedThreadParams {
  /** returns threads before this id */
  before?: Snowflake
  /** optional maximum number of threads to return */
  limit?: number
}
export interface ListJoinedPrivateArchivedThreadResponse {
  /** the private, archived threads the current user has joined */
  threads: Channel[]
  /** a thread member object for each returned thread the current user has joined */
  members: ThreadMember[]
  /** whether there are potentially additional threads that could be returned on a subsequent call */
  has_more: boolean
}
export interface ListPrivateArchivedThreadParams {
  /** returns threads before this timestamp */
  before?: string
  /** optional maximum number of threads to return */
  limit?: number
}
export interface ListPrivateArchivedThreadResponse {
  /** the private, archived threads */
  threads: Channel[]
  /** a thread member object for each returned thread the current user has joined */
  members: ThreadMember[]
  /** whether there are potentially additional threads that could be returned on a subsequent call */
  has_more: boolean
}
export interface ListPublicArchivedThreadParams {
  /** returns threads before this timestamp */
  before?: string
  /** optional maximum number of threads to return */
  limit?: number
}
export interface ListPublicArchivedThreadResponse {
  /** the public, archived threads */
  threads: Channel[]
  /** a thread member object for each returned thread the current user has joined */
  members: ThreadMember[]
  /** whether there are potentially additional threads that could be returned on a subsequent call */
  has_more: boolean
}
export interface ListScheduledEventsForGuildParams {
  /** include number of users subscribed to each event */
  with_user_count?: boolean
}
export enum MembershipState {
  INVITED = 1,
  ACCEPTED = 2,
}
export interface Message {
  /** id of the message */
  id: Snowflake
  /** id of the channel the message was sent in */
  channel_id: Snowflake
  /** id of the guild the message was sent in */
  guild_id?: Snowflake
  /** the author of this message (not guaranteed to be a valid user, see below) */
  author: User
  /** member properties for this message's author */
  member?: GuildMember
  /** contents of the message */
  content: string
  /** when this message was sent */
  timestamp: string
  /** when this message was edited (or null if never) */
  edited_timestamp?: string | null
  /** whether this was a TTS message */
  tts: boolean
  /** whether this message mentions everyone */
  mention_everyone: boolean
  /** users specifically mentioned in the message */
  mentions: User[]
  /** roles specifically mentioned in this message */
  mention_roles: Snowflake[]
  /** channels specifically mentioned in this message */
  mention_channels?: ChannelMention[]
  /** any attached files */
  attachments: Attachment[]
  /** any embedded content */
  embeds: Embed[]
  /** reactions to the message */
  reactions?: Reaction[]
  /** used for validating a message was sent */
  nonce?: string
  /** whether this message is pinned */
  pinned: boolean
  /** if the message is generated by a webhook, this is the webhook's id */
  webhook_id?: Snowflake
  /** type of message */
  type: MessageType
  /** sent with Rich Presence-related chat embeds */
  activity?: MessageActivity
  /** sent with Rich Presence-related chat embeds */
  application?: Application
  /** if the message is an Interaction or application-owned webhook, this is the id of the application */
  application_id?: Snowflake
  /** data showing the source of a crosspost, channel follow add, pin, or reply message */
  message_reference?: MessageReference
  /** message flags combined as a bitfield */
  flags?: number
  /** the message associated with the message_reference */
  referenced_message?: Message | null
  /** sent if the message is a response to an Interaction */
  interaction?: MessageInteraction
  /** the thread that was started from this message, includes thread member object */
  thread?: Channel
  /** sent if the message contains components like buttons, action rows, or other interactive components */
  components?: Component[]
  /** sent if the message contains stickers */
  sticker_items?: StickerItem[]
  /** Deprecated the stickers sent with the message */
  stickers?: Sticker[]
}
export interface MessageActivity {
  /** type of message activity */
  type: MessageActivityType
  /** party_id from a Rich Presence event */
  party_id?: string
}
export enum MessageActivityType {
  JOIN = 1,
  SPECTATE = 2,
  LISTEN = 3,
  JOIN_REQUEST = 5,
}
export type MessageCreateEvent = Message
export interface MessageDeleteBulkEvent {
  /** the ids of the messages */
  ids: Snowflake[]
  /** the id of the channel */
  channel_id: Snowflake
  /** the id of the guild */
  guild_id?: Snowflake
}
export interface MessageDeleteEvent {
  /** the id of the message */
  id: Snowflake
  /** the id of the channel */
  channel_id: Snowflake
  /** the id of the guild */
  guild_id?: Snowflake
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
} as const
export interface MessageInteraction {
  /** id of the interaction */
  id: Snowflake
  /** the type of interaction */
  type: InteractionType
  /** the name of the application command */
  name: string
  /** the user who invoked the interaction */
  user: User
  /** the member who invoked the interaction in the guild */
  member?: GuildMember
}
export interface MessageReactionAddEvent {
  /** the id of the user */
  user_id: Snowflake
  /** the id of the channel */
  channel_id: Snowflake
  /** the id of the message */
  message_id: Snowflake
  /** the id of the guild */
  guild_id?: Snowflake
  /** the member who reacted if this happened in a guild */
  member?: GuildMember
  /** the emoji used to react - example */
  emoji: Emoji
}
export interface MessageReactionRemoveAllEvent {
  /** the id of the channel */
  channel_id: Snowflake
  /** the id of the message */
  message_id: Snowflake
  /** the id of the guild */
  guild_id?: Snowflake
}
export interface MessageReactionRemoveEmojiEvent {
  /** the id of the channel */
  channel_id: Snowflake
  /** the id of the guild */
  guild_id?: Snowflake
  /** the id of the message */
  message_id: Snowflake
  /** the emoji that was removed */
  emoji: Emoji
}
export interface MessageReactionRemoveEvent {
  /** the id of the user */
  user_id: Snowflake
  /** the id of the channel */
  channel_id: Snowflake
  /** the id of the message */
  message_id: Snowflake
  /** the id of the guild */
  guild_id?: Snowflake
  /** the emoji used to react - example */
  emoji: Emoji
}
export interface MessageReference {
  /** id of the originating message */
  message_id?: Snowflake
  /** id of the originating message's channel */
  channel_id?: Snowflake
  /** id of the originating message's guild */
  guild_id?: Snowflake
  /** when sending, whether to error if the referenced message doesn't exist instead of sending as a normal (non-reply) message, default true */
  fail_if_not_exists?: boolean
}
export enum MessageType {
  DEFAULT = 0,
  RECIPIENT_ADD = 1,
  RECIPIENT_REMOVE = 2,
  CALL = 3,
  CHANNEL_NAME_CHANGE = 4,
  CHANNEL_ICON_CHANGE = 5,
  CHANNEL_PINNED_MESSAGE = 6,
  GUILD_MEMBER_JOIN = 7,
  USER_PREMIUM_GUILD_SUBSCRIPTION = 8,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1 = 9,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2 = 10,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3 = 11,
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
}
export type MessageUpdateEvent = Message
export enum MfaLevel {
  /** guild has no MFA/2FA requirement for moderation actions */
  NONE = 0,
  /** guild has a 2FA requirement for moderation actions */
  ELEVATED = 1,
}
export interface ModifyChannelGroupDmParams {
  /** 1-100 character channel name */
  name: string
  /** base64 encoded icon */
  icon: string
}
export interface ModifyChannelGuildChannelParams {
  /** 1-100 character channel name */
  name: string
  /** the type of channel; only conversion between text and news is supported and only in guilds with the "NEWS" feature */
  type: ChannelType
  /** the position of the channel in the left-hand listing */
  position?: number | null
  /** 0-1024 character channel topic */
  topic?: string | null
  /** whether the channel is nsfw */
  nsfw?: boolean | null
  /** amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission manage_messages or manage_channel, are unaffected */
  rate_limit_per_user?: number | null
  /** the bitrate (in bits) of the voice channel; 8000 to 96000 (128000 for VIP servers) */
  bitrate?: number | null
  /** the user limit of the voice channel; 0 refers to no limit, 1 to 99 refers to a user limit */
  user_limit?: number | null
  /** channel or category-specific permissions */
  permission_overwrites?: Overwrite[] | null
  /** id of the new parent category for a channel */
  parent_id?: Snowflake | null
  /** channel voice region id, automatic when set to null */
  rtc_region?: string | null
  /** the camera video quality mode of the voice channel */
  video_quality_mode?: VideoQualityMode | null
  /** the default duration that the clients use (not the API) for newly created threads in the channel, in minutes, to automatically archive the thread after recent activity */
  default_auto_archive_duration?: number | null
}
export type ModifyChannelParams =
  | ModifyChannelGroupDmParams
  | ModifyChannelGuildChannelParams
  | ModifyChannelThreadParams
export interface ModifyChannelThreadParams {
  /** 1-100 character channel name */
  name: string
  /** whether the thread is archived */
  archived: boolean
  /** duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080 */
  auto_archive_duration: number
  /** whether the thread is locked; when a thread is locked, only users with MANAGE_THREADS can unarchive it */
  locked: boolean
  /** whether non-moderators can add other non-moderators to a thread; only available on private threads */
  invitable: boolean
  /** amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission manage_messages, manage_thread, or manage_channel, are unaffected */
  rate_limit_per_user?: number | null
}
export interface ModifyCurrentMemberParams {
  /** value to set user's nickname to */
  nick?: string | null
}
export interface ModifyCurrentUserNickParams {
  /** value to set user's nickname to */
  nick?: string | null
}
export interface ModifyCurrentUserParams {
  /** user's username, if changed may cause the user's discriminator to be randomized. */
  username: string
  /** if passed, modifies the user's avatar */
  avatar?: string | null
}
export interface ModifyCurrentUserVoiceStateParams {
  /** the id of the channel the user is currently in */
  channel_id: Snowflake
  /** toggles the user's suppress state */
  suppress?: boolean
  /** sets the user's request to speak */
  request_to_speak_timestamp?: string | null
}
export interface ModifyGuildChannelPositionParams {
  /** channel id */
  id: Snowflake
  /** sorting position of the channel */
  position?: number | null
  /** syncs the permission overwrites with the new parent, if moving to a new category */
  lock_permissions?: boolean | null
  /** the new parent ID for the channel that is moved */
  parent_id?: Snowflake | null
}
export interface ModifyGuildEmojiParams {
  /** name of the emoji */
  name: string
  /** roles allowed to use this emoji */
  roles?: Snowflake[] | null
}
export interface ModifyGuildMemberParams {
  /** value to set user's nickname to */
  nick: string
  /** array of role ids the member is assigned */
  roles: Snowflake[]
  /** whether the user is muted in voice channels. Will throw a 400 error if the user is not in a voice channel */
  mute: boolean
  /** whether the user is deafened in voice channels. Will throw a 400 error if the user is not in a voice channel */
  deaf: boolean
  /** id of channel to move user to (if they are connected to voice) */
  channel_id: Snowflake
  /** when the user's timeout will expire and the user will be able to communicate in the guild again (up to 28 days in the future), set to null to remove timeout. Will throw a 403 error if the user has the ADMINISTRATOR permission or is the owner of the guild */
  communication_disabled_until?: string | null
}
export interface ModifyGuildParams {
  /** guild name */
  name: string
  /** guild voice region id (deprecated) */
  region?: string | null
  /** verification level */
  verification_level?: VerificationLevel | null
  /** default message notification level */
  default_message_notifications?: DefaultMessageNotificationLevel | null
  /** explicit content filter level */
  explicit_content_filter?: ExplicitContentFilterLevel | null
  /** id for afk channel */
  afk_channel_id?: Snowflake | null
  /** afk timeout in seconds */
  afk_timeout: number
  /** base64 1024x1024 png/jpeg/gif image for the guild icon (can be animated gif when the server has the ANIMATED_ICON feature) */
  icon?: string | null
  /** user id to transfer guild ownership to (must be owner) */
  owner_id: Snowflake
  /** base64 16:9 png/jpeg image for the guild splash (when the server has the INVITE_SPLASH feature) */
  splash?: string | null
  /** base64 16:9 png/jpeg image for the guild discovery splash (when the server has the DISCOVERABLE feature) */
  discovery_splash?: string | null
  /** base64 16:9 png/jpeg image for the guild banner (when the server has the BANNER feature) */
  banner?: string | null
  /** the id of the channel where guild notices such as welcome messages and boost events are posted */
  system_channel_id?: Snowflake | null
  /** system channel flags */
  system_channel_flags: number
  /** the id of the channel where Community guilds display rules and/or guidelines */
  rules_channel_id?: Snowflake | null
  /** the id of the channel where admins and moderators of Community guilds receive notices from Discord */
  public_updates_channel_id?: Snowflake | null
  /** the preferred locale of a Community guild used in server discovery and notices from Discord; defaults to "en-US" */
  preferred_locale?: string | null
  /** enabled guild features */
  features: GuildFeature[]
  /** the description for the guild, if the guild is discoverable */
  description?: string | null
  /** whether the guild's boost progress bar should be enabled. */
  premium_progress_bar_enabled: boolean
}
export interface ModifyGuildRoleParams {
  /** name of the role */
  name: string
  /** bitwise value of the enabled/disabled permissions */
  permissions: string
  /** RGB color value */
  color: number
  /** whether the role should be displayed separately in the sidebar */
  hoist: boolean
  /** the role's icon image (if the guild has the ROLE_ICONS feature) */
  icon: string
  /** the role's unicode emoji as a standard emoji (if the guild has the ROLE_ICONS feature) */
  unicode_emoji: string
  /** whether the role should be mentionable */
  mentionable: boolean
}
export interface ModifyGuildRolePositionParams {
  /** role */
  id: Snowflake
  /** sorting position of the role */
  position?: number | null
}
export interface ModifyGuildScheduledEventParams {
  /** the channel id of the scheduled event, set to null if changing entity type to EXTERNAL */
  channel_id?: Snowflake | null
  /** the entity metadata of the scheduled event */
  entity_metadata?: GuildScheduledEventEntityMetadatum | null
  /** the name of the scheduled event */
  name?: string
  /** the privacy level of the scheduled event */
  privacy_level?: GuildScheduledEventPrivacyLevel
  /** the time to schedule the scheduled event */
  scheduled_start_time?: string
  /** the time when the scheduled event is scheduled to end */
  scheduled_end_time?: string
  /** the description of the scheduled event */
  description?: string | null
  /** the entity type of the scheduled event */
  entity_type?: GuildScheduledEventEntityType
  /** the status of the scheduled event */
  status?: GuildScheduledEventStatus
  /** the cover image of the scheduled event */
  image?: string
}
export interface ModifyGuildStickerParams {
  /** name of the sticker (2-30 characters) */
  name: string
  /** description of the sticker (2-100 characters) */
  description?: string | null
  /** autocomplete/suggestion tags for the sticker (max 200 characters) */
  tags: string
}
export interface ModifyGuildTemplateParams {
  /** name of the template (1-100 characters) */
  name?: string
  /** description for the template (0-120 characters) */
  description?: string | null
}
export interface ModifyGuildWelcomeScreenParams {
  /** whether the welcome screen is enabled */
  enabled: boolean
  /** channels linked in the welcome screen and their display options */
  welcome_channels: WelcomeScreenChannel[]
  /** the server description to show in the welcome screen */
  description: string
}
export interface ModifyStageInstanceParams {
  /** The topic of the Stage instance (1-120 characters) */
  topic?: string
  /** The privacy level of the Stage instance */
  privacy_level?: PrivacyLevel
}
export interface ModifyUserVoiceStateParams {
  /** the id of the channel the user is currently in */
  channel_id: Snowflake
  /** toggles the user's suppress state */
  suppress?: boolean
}
export interface ModifyWebhookParams {
  /** the default name of the webhook */
  name: string
  /** image for the default webhook avatar */
  avatar?: string | null
  /** the new channel id this webhook should be moved to */
  channel_id: Snowflake
}
export interface Overwrite {
  /** role or user id */
  id: Snowflake
  /** either 0 (role) or 1 (member) */
  type: number
  /** permission bit set */
  allow: string
  /** permission bit set */
  deny: string
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
  /** Allows for sending messages in a channel (does not allow sending messages in threads) */
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
  /** Allows management and editing of emojis and stickers */
  MANAGE_EMOJIS_AND_STICKERS: BigInt(1) << BigInt(30),
  /** Allows members to use application commands, including slash commands and context menu commands. */
  USE_APPLICATION_COMMANDS: BigInt(1) << BigInt(31),
  /** Allows for requesting to speak in stage channels. (This permission is under active development and may be changed or removed.) */
  REQUEST_TO_SPEAK: BigInt(1) << BigInt(32),
  /** Allows for creating, editing, and deleting scheduled events */
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
}
export interface PresenceUpdateEvent {
  /** the user presence is being updated for */
  user: User
  /** id of the guild */
  guild_id: Snowflake
  /** either "idle", "dnd", "online", or "offline" */
  status: string
  /** user's current activities */
  activities: Activity[]
  /** user's platform-dependent status */
  client_status: ClientStatus
}
export enum PrivacyLevel {
  /** The Stage instance is visible publicly. (deprecated) */
  PUBLIC = 1,
  /** The Stage instance is visible to only guild members. */
  GUILD_ONLY = 2,
}
export interface Reaction {
  /** times this emoji has been used to react */
  count: number
  /** whether the current user reacted using this emoji */
  me: boolean
  /** emoji information */
  emoji: Emoji
}
export interface ReadyEvent {
  /** gateway version */
  v: number
  /** information about the user including email */
  user: User
  /** the guilds the user is in */
  guilds: UnavailableGuild[]
  /** used for resuming connections */
  session_id: string
  /** the shard information associated with this session, if sent when identifying */
  shard?: number[]
  /** contains id and flags */
  application: Application
}
export type ReconnectEvent = null
export interface RequestGuildMember {
  /** id of the guild to get members for */
  guild_id: Snowflake
  /** string that username starts with, or an empty string to return all members */
  query?: string
  /** maximum number of members to send matching the query; a limit of 0 can be used with an empty string query to return all members */
  limit: number
  /** used to specify if we want the presences of the matched members */
  presences?: boolean
  /** used to specify which users you wish to fetch */
  user_ids?: Snowflake[]
  /** nonce to identify the Guild Members Chunk response */
  nonce?: string
}
export interface ResolvedDatum {
  /** the ids and User objects */
  users?: Record<Snowflake, User>
  /** the ids and partial Member objects */
  members?: Record<Snowflake, GuildMember>
  /** the ids and Role objects */
  roles?: Record<Snowflake, Role>
  /** the ids and partial Channel objects */
  channels?: Record<Snowflake, Channel>
  /** the ids and partial Message objects */
  messages?: Record<Snowflake, Message>
  /** the ids and attachment objects */
  attachments?: Record<Snowflake, Attachment>
}
export interface ResponseBody {
  /** the active threads */
  threads: Channel[]
  /** a thread member object for each returned thread the current user has joined */
  members: ThreadMember[]
  /** whether there are potentially additional threads that could be returned on a subsequent call */
  has_more: boolean
}
export interface Resume {
  /** session token */
  token: string
  /** session id */
  session_id: string
  /** last sequence number received */
  seq: number
}
export type ResumedEvent = null
export interface Role {
  /** role id */
  id: Snowflake
  /** role name */
  name: string
  /** integer representation of hexadecimal color code */
  color: number
  /** if this role is pinned in the user listing */
  hoist: boolean
  /** role icon hash */
  icon?: string | null
  /** role unicode emoji */
  unicode_emoji?: string | null
  /** position of this role */
  position: number
  /** permission bit set */
  permissions: string
  /** whether this role is managed by an integration */
  managed: boolean
  /** whether this role is mentionable */
  mentionable: boolean
  /** the tags this role has */
  tags?: RoleTag
}
export interface RoleTag {
  /** the id of the bot this role belongs to */
  bot_id?: Snowflake
  /** the id of the integration this role belongs to */
  integration_id?: Snowflake
  /** whether this is the guild's premium subscriber role */
  premium_subscriber?: null
}
export type Route<P, O> = {
  method: string
  url: string
  params?: P
  options?: O
}
export interface SearchGuildMemberParams {
  /** Query string to match username(s) and nickname(s) against. */
  query: string
  /** max number of members to return (1-1000) */
  limit: number
}
export interface SelectMenu {
  /** 3 for a select menu */
  type: number
  /** a developer-defined identifier for the button, max 100 characters */
  custom_id: string
  /** the choices in the select, max 25 */
  options: SelectOption[]
  /** custom placeholder text if nothing is selected, max 150 characters */
  placeholder?: string
  /** the minimum number of items that must be chosen; default 1, min 0, max 25 */
  min_values?: number
  /** the maximum number of items that can be chosen; default 1, max 25 */
  max_values?: number
  /** disable the select, default false */
  disabled?: boolean
}
export interface SelectOption {
  /** the user-facing name of the option, max 100 characters */
  label: string
  /** the dev-define value of the option, max 100 characters */
  value: string
  /** an additional description of the option, max 100 characters */
  description?: string
  /** id, name, and animated */
  emoji?: Emoji
  /** will render this option as selected by default */
  default?: boolean
}
export interface SessionStartLimit {
  /** The total number of session starts the current user is allowed */
  total: number
  /** The remaining number of session starts the current user is allowed */
  remaining: number
  /** The number of milliseconds after which the limit resets */
  reset_after: number
  /** The number of identify requests allowed per 5 seconds */
  max_concurrency: number
}
export type Snowflake = `${bigint}`
export interface StageInstance {
  /** The id of this Stage instance */
  id: Snowflake
  /** The guild id of the associated Stage channel */
  guild_id: Snowflake
  /** The id of the associated Stage channel */
  channel_id: Snowflake
  /** The topic of the Stage instance (1-120 characters) */
  topic: string
  /** The privacy level of the Stage instance */
  privacy_level: PrivacyLevel
  /** Whether or not Stage Discovery is disabled (deprecated) */
  discoverable_disabled: boolean
  /** The id of the scheduled event for this Stage instance */
  guild_scheduled_event_id?: Snowflake | null
}
export type StageInstanceCreateEvent = StageInstance
export type StageInstanceDeleteEvent = StageInstance
export type StageInstanceUpdateEvent = StageInstance
export interface StartThreadWithMessageParams {
  /** 1-100 character channel name */
  name: string
  /** duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080 */
  auto_archive_duration?: number
  /** amount of seconds a user has to wait before sending another message (0-21600) */
  rate_limit_per_user?: number | null
}
export interface StartThreadWithoutMessageParams {
  /** 1-100 character channel name */
  name: string
  /** duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080 */
  auto_archive_duration?: number
  /** the type of thread to create */
  type?: ChannelType
  /** whether non-moderators can add other non-moderators to a thread; only available when creating a private thread */
  invitable?: boolean
  /** amount of seconds a user has to wait before sending another message (0-21600) */
  rate_limit_per_user?: number | null
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
  id: Snowflake
  /** for standard stickers, id of the pack the sticker is from */
  pack_id?: Snowflake
  /** name of the sticker */
  name: string
  /** description of the sticker */
  description?: string | null
  /** autocomplete/suggestion tags for the sticker (max 200 characters) */
  tags: string
  /** Deprecated previously the sticker asset hash, now an empty string */
  asset?: string
  /** type of sticker */
  type: StickerType
  /** type of sticker format */
  format_type: StickerFormatType
  /** whether this guild sticker can be used, may be false due to loss of Server Boosts */
  available?: boolean
  /** id of the guild that owns this sticker */
  guild_id?: Snowflake
  /** the user that uploaded the guild sticker */
  user?: User
  /** the standard sticker's sort order within its pack */
  sort_value?: number
}
export enum StickerFormatType {
  PNG = 1,
  APNG = 2,
  LOTTIE = 3,
}
export interface StickerItem {
  /** id of the sticker */
  id: Snowflake
  /** name of the sticker */
  name: string
  /** type of sticker format */
  format_type: StickerFormatType
}
export interface StickerPack {
  /** id of the sticker pack */
  id: Snowflake
  /** the stickers in the pack */
  stickers: Sticker[]
  /** name of the sticker pack */
  name: string
  /** id of the pack's SKU */
  sku_id: Snowflake
  /** id of a sticker in the pack which is shown as the pack's icon */
  cover_sticker_id?: Snowflake
  /** description of the sticker pack */
  description: string
  /** id of the sticker pack's banner image */
  banner_asset_id?: Snowflake
}
export enum StickerType {
  /** an official sticker in a pack, part of Nitro or in a removed purchasable pack */
  STANDARD = 1,
  /** a sticker uploaded to a Boosted guild for the guild's members */
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
} as const
export interface Team {
  /** a hash of the image of the team's icon */
  icon?: string | null
  /** the unique id of the team */
  id: Snowflake
  /** the members of the team */
  members: TeamMember[]
  /** the name of the team */
  name: string
  /** the user id of the current team owner */
  owner_user_id: Snowflake
}
export interface TeamMember {
  /** the user's membership state on the team */
  membership_state: MembershipState
  /** will always be ["*"] */
  permissions: string[]
  /** the id of the parent team of which they are a member */
  team_id: Snowflake
  /** the avatar, discriminator, id, and username of the user */
  user: User
}
export interface TextInput {
  /** 4 for a text input */
  type: number
  /** a developer-defined identifier for the input, max 100 characters */
  custom_id: string
  /** the Text Input Style */
  style: TextInputStyle
  /** the label for this component */
  label: string
  /** the minimum input length for a text input, min 0, max 4000 */
  min_length?: number
  /** the maximum input length for a text input, min 1, max 4000 */
  max_length?: number
  /** whether this component is required to be filled, default true */
  required?: boolean
  /** a pre-filled value for this component, max 4000 characters */
  value?: string
  /** custom placeholder text if the input is empty, max 100 characters */
  placeholder?: string
}
export enum TextInputStyle {
  /** A single-line input */
  SHORT = 1,
  /** A multi-line input */
  PARAGRAPH = 2,
}
export type ThreadCreateEvent = Channel
export type ThreadDeleteEvent = Channel
export interface ThreadListSyncEvent {
  /** the id of the guild */
  guild_id: Snowflake
  /** the parent channel ids whose threads are being synced.  If omitted, then threads were synced for the entire guild.  This array may contain channel_ids that have no active threads as well, so you know to clear that data. */
  channel_ids?: Snowflake[]
  /** all active threads in the given channels that the current user can access */
  threads: Channel[]
  /** all thread member objects from the synced threads for the current user, indicating which threads the current user has been added to */
  members: ThreadMember[]
}
export interface ThreadMember {
  /** the id of the thread */
  id?: Snowflake
  /** the id of the user */
  user_id?: Snowflake
  /** the time the current user last joined the thread */
  join_timestamp: string
  /** any user-thread settings, currently only used for notifications */
  flags: number
}
export interface ThreadMembersUpdateEvent {
  /** the id of the thread */
  id: Snowflake
  /** the id of the guild */
  guild_id: Snowflake
  /** the approximate number of members in the thread, capped at 50 */
  member_count: number
  /** the users who were added to the thread */
  added_members?: ThreadMember[]
  /** the id of the users who were removed from the thread */
  removed_member_ids?: Snowflake[]
}
export type ThreadMemberUpdateEvent = ThreadMember
export interface ThreadMemberUpdateEventExtra {
  /** the id of the guild */
  guild_id: Snowflake
}
export interface ThreadMetadatum {
  /** whether the thread is archived */
  archived: boolean
  /** duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080 */
  auto_archive_duration: number
  /** timestamp when the thread's archive status was last changed, used for calculating recent activity */
  archive_timestamp: string
  /** whether the thread is locked; when a thread is locked, only users with MANAGE_THREADS can unarchive it */
  locked: boolean
  /** whether non-moderators can add other non-moderators to a thread; only available on private threads */
  invitable?: boolean
  /** timestamp when the thread was created; only populated for threads created after 2022-01-09 */
  create_timestamp?: string | null
}
export type ThreadUpdateEvent = Channel
export interface TypingStartEvent {
  /** id of the channel */
  channel_id: Snowflake
  /** id of the guild */
  guild_id?: Snowflake
  /** id of the user */
  user_id: Snowflake
  /** unix time (in seconds) of when the user started typing */
  timestamp: number
  /** the member who started typing if this happened in a guild */
  member?: GuildMember
}
export interface UnavailableGuild {
  /**  */
  id: Snowflake
  /**  */
  unavailable: boolean
}
export interface UpdatePresence {
  /** unix time (in milliseconds) of when the client went idle, or null if the client is not idle */
  since?: number | null
  /** the user's activities */
  activities: Activity[]
  /** the user's new status */
  status: StatusType
  /** whether or not the client is afk */
  afk: boolean
}
export interface UpdateVoiceState {
  /** id of the guild */
  guild_id: Snowflake
  /** id of the voice channel client wants to join (null if disconnecting) */
  channel_id?: Snowflake | null
  /** is the client muted */
  self_mute: boolean
  /** is the client deafened */
  self_deaf: boolean
}
export interface User {
  /** the user's id */
  id: Snowflake
  /** the user's username, not unique across the platform */
  username: string
  /** the user's 4-digit discord-tag */
  discriminator: string
  /** the user's avatar hash */
  avatar?: string | null
  /** whether the user belongs to an OAuth2 application */
  bot?: boolean
  /** whether the user is an Official Discord System user (part of the urgent message system) */
  system?: boolean
  /** whether the user has two factor enabled on their account */
  mfa_enabled?: boolean
  /** the user's banner hash */
  banner?: string | null
  /** the user's banner color encoded as an integer representation of hexadecimal color code */
  accent_color?: number | null
  /** the user's chosen language option */
  locale?: string
  /** whether the email on this account has been verified */
  verified?: boolean
  /** the user's email */
  email?: string | null
  /** the flags on a user's account */
  flags?: number
  /** the type of Nitro subscription on a user's account */
  premium_type?: PremiumType
  /** the public flags on a user's account */
  public_flags?: number
}
export const UserFlag = {
  /** Discord Employee */
  STAFF: 1 << 0,
  /** Partnered Server Owner */
  PARTNER: 1 << 1,
  /** HypeSquad Events Coordinator */
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
  /** Discord Certified Moderator */
  CERTIFIED_MODERATOR: 1 << 18,
  /** Bot uses only HTTP interactions and is shown in the online member list */
  BOT_HTTP_INTERACTIONS: 1 << 19,
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
  id: string
  /** name of the region */
  name: string
  /** true for a single server that is closest to the current user's client */
  optimal: boolean
  /** whether this is a deprecated voice region (avoid switching to these) */
  deprecated: boolean
  /** whether this is a custom voice region (used for events/etc) */
  custom: boolean
}
export interface VoiceServerUpdateEvent {
  /** voice connection token */
  token: string
  /** the guild this voice server update is for */
  guild_id: Snowflake
  /** the voice server host */
  endpoint?: string | null
}
export interface VoiceState {
  /** the guild id this voice state is for */
  guild_id?: Snowflake
  /** the channel id this user is connected to */
  channel_id?: Snowflake | null
  /** the user id this voice state is for */
  user_id: Snowflake
  /** the guild member this voice state is for */
  member?: GuildMember
  /** the session id for this voice state */
  session_id: string
  /** whether this user is deafened by the server */
  deaf: boolean
  /** whether this user is muted by the server */
  mute: boolean
  /** whether this user is locally deafened */
  self_deaf: boolean
  /** whether this user is locally muted */
  self_mute: boolean
  /** whether this user is streaming using "Go Live" */
  self_stream?: boolean
  /** whether this user's camera is enabled */
  self_video: boolean
  /** whether this user is muted by the current user */
  suppress: boolean
  /** the time at which the user requested to speak */
  request_to_speak_timestamp?: string | null
}
export type VoiceStateUpdateEvent = VoiceState
export interface Webhook {
  /** the id of the webhook */
  id: Snowflake
  /** the type of the webhook */
  type: WebhookType
  /** the guild id this webhook is for, if any */
  guild_id?: Snowflake | null
  /** the channel id this webhook is for, if any */
  channel_id?: Snowflake | null
  /** the user this webhook was created by (not returned when getting a webhook with its token) */
  user?: User
  /** the default name of the webhook */
  name?: string | null
  /** the default user avatar hash of the webhook */
  avatar?: string | null
  /** the secure token of the webhook (returned for Incoming Webhooks) */
  token?: string
  /** the bot/OAuth2 application that created this webhook */
  application_id?: Snowflake | null
  /** the guild of the channel that this webhook is following (returned for Channel Follower Webhooks) */
  source_guild?: Guild
  /** the channel that this webhook is following (returned for Channel Follower Webhooks) */
  source_channel?: Channel
  /** the url used for executing the webhook (returned by the webhooks OAuth2 flow) */
  url?: string
}
export interface WebhooksUpdateEvent {
  /** id of the guild */
  guild_id: Snowflake
  /** id of the channel */
  channel_id: Snowflake
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
  description?: string | null
  /** the channels shown in the welcome screen, up to 5 */
  welcome_channels: WelcomeScreenChannel[]
}
export interface WelcomeScreenChannel {
  /** the channel's id */
  channel_id: Snowflake
  /** the description shown for the channel */
  description: string
  /** the emoji id, if the emoji is custom */
  emoji_id?: Snowflake | null
  /** the emoji name if custom, the unicode character if standard, or null if no emoji is set */
  emoji_name?: string | null
}
