import type * as Rest from "./DiscordREST/Generated.ts"
import type { APIInteraction } from "discord-api-types/v10"

export * from "./DiscordREST/Generated.ts"
export type {
  APIInteraction,
  APIBaseApplicationCommandInteractionData,
  APIApplicationCommandAutocompleteInteraction,
  APIAutocompleteApplicationCommandInteractionData,
  APIApplicationCommandInteractionDataOption,
  APIApplicationCommandInteraction,
  APIApplicationCommandSubcommandOption,
  APIApplicationCommandInteractionDataSubcommandOption,
  APIChatInputApplicationCommandInteraction,
  APIChatInputApplicationCommandInteractionData,
  APIChatInputApplicationCommandDMInteraction,
  APIChatInputApplicationCommandGuildInteraction,
  APIMessageApplicationCommandInteraction,
  APIMessageComponentInteraction,
  APIMessageComponentInteractionData,
  APIModalSubmitInteraction,
  APIModalSubmission,
  APIPingInteraction,
} from "discord-api-types/v10"
export {
  MessageFlags,
  PermissionFlagsBits as Permissions,
  EmbedType,
} from "discord-api-types/v10"

export type Snowflake = Rest.SnowflakeType

export type APIApplication = Rest.ApplicationResponse
export type APIApplicationCommandPermission = Rest.ApplicationCommandPermission
export type APIAutoModerationRule = Rest.GetAutoModerationRule200
export type APIAutoModerationActionMetadata =
  | Rest.BlockMessageActionMetadata
  | Rest.QuarantineUserActionMetadata
  | Rest.FlagToChannelActionMetadata
  | Rest.UserCommunicationDisabledActionMetadata
interface APIAutoModerationAction {
  readonly type: Rest.AutomodActionType
  readonly metadata?: APIAutoModerationActionMetadata
}
export type APIChannel = Rest.GetChannel200
export type APIEmoji = Rest.EmojiResponse
export type APIGuild = Rest.GuildResponse
export type APIGuildIntegration = Rest.ListGuildIntegrations200[number]
export type APIGuildMember = Rest.GuildMemberResponse
export type APIGuildScheduledEvent = Rest.ScheduledEventResponse
export type APIMessage = Rest.MessageResponse
export type APIRole = Rest.GuildRoleResponse
export type APIStageInstance = Rest.StageInstanceResponse
export type APISticker = Rest.GuildStickerResponse
export type APIThreadChannel = Rest.ThreadResponse
export type APIThreadMember = Rest.ThreadMemberResponse
export interface APIUnavailableGuild {
  readonly id: Snowflake
  readonly unavailable: boolean
}
export type APIUser = Rest.UserResponse
export type APIVoiceState = Rest.VoiceStateResponse
export type InviteTargetType = Rest.InviteTargetTypes
export type AutoModerationRuleTriggerType = Rest.AutomodTriggerType
export type GatewayAuditLogEntry = Rest.AuditLogEntryResponse
export type APIAuditLogEntry = Rest.AuditLogEntryResponse
export type APIEntitlement = Rest.EntitlementResponse
export type ChannelType = Rest.ChannelTypes
export interface APISubscription {
  /**
   * ID of the subscription
   */
  id: Snowflake
  /**
   * ID of the user who is subscribed
   */
  user_id: Snowflake
  /**
   * List of SKUs subscribed to
   */
  sku_ids: Array<Snowflake>
  /**
   * List of entitlements granted for this subscription
   */
  entitlement_ids: Array<Snowflake>
  /**
   * List of SKUs that this user will be subscribed to at renewal
   */
  renewal_sku_ids: Array<Snowflake> | null
  /**
   * Start of the current subscription period
   */
  current_period_start: string
  /**
   * End of the current subscription period
   */
  current_period_end: string
  /**
   * Current status of the subscription
   */
  status: SubscriptionStatus
  /**
   * When the subscription was canceled
   */
  canceled_at: string | null
  /**
   * ISO3166-1 alpha-2 country code of the payment source used to purchase the subscription. Missing unless queried with a private OAuth scope.
   */
  country?: string
}
export enum SubscriptionStatus {
  /**
   * Subscription is active and scheduled to renew.
   */
  Active,
  /**
   * Subscription is active but will not renew.
   */
  Ending,
  /**
   * Subscription is inactive and not being charged.
   */
  Inactive,
}
export type APISoundboardSound = Rest.SoundboardSoundResponse
export type GuildChannelType = Rest.GuildChannelResponse["type"]
export type ThreadChannelType = Rest.ThreadResponse["type"]
export type ReactionType = Rest.ReactionTypes

type RawGatewayPresenceUpdate = GatewayPresenceUpdate
type RawGatewayThreadListSync = GatewayThreadListSync
type RawGatewayThreadMembersUpdate = GatewayThreadMembersUpdate

type _Nullable<T> = {
  [P in keyof T]: T[P] | null
}

export interface InteractionDataResolved {
  readonly users?: Record<Snowflake, Rest.UserResponse>
  readonly roles?: Record<Snowflake, Rest.GuildRoleResponse>
  readonly members?: Record<Snowflake, Rest.GuildMemberResponse>
  readonly channels?: Record<Snowflake, Rest.GuildChannelResponse>
  readonly messages?: Record<Snowflake, Rest.MessageResponse>
  readonly attachments?: Record<Snowflake, Rest.AttachmentResponse>
}

export type MessageComponent = Rest.MessageResponse["components"][number]

export type AllComponents =
  | MessageComponent
  | (Rest.ActionRowComponentResponse["components"] & {})[number]

export type DistributedGatewayDispatchPayload =
  GatewayDispatchPayload extends infer Payload
    ? Payload extends _DataPayload<infer Event, infer D>
      ? Event extends Event
        ? _DataPayload<Event, D>
        : never
      : Payload
    : never

// =============================================================================

/**
 * The following types have been taken from the discord-api-types package under
 * the MIT license.
 */

// =============================================================================

/**
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes}
 */
export enum GatewayOpcodes {
  /**
   * An event was dispatched
   */
  Dispatch,
  /**
   * A bidirectional opcode to maintain an active gateway connection.
   * Fired periodically by the client, or fired by the gateway to request an immediate heartbeat from the client.
   */
  Heartbeat,
  /**
   * Starts a new session during the initial handshake
   */
  Identify,
  /**
   * Update the client's presence
   */
  PresenceUpdate,
  /**
   * Used to join/leave or move between voice channels
   */
  VoiceStateUpdate,
  /**
   * Resume a previous session that was disconnected
   */
  Resume = 6,
  /**
   * You should attempt to reconnect and resume immediately
   */
  Reconnect,
  /**
   * Request information about offline guild members in a large guild
   */
  RequestGuildMembers,
  /**
   * The session has been invalidated. You should reconnect and identify/resume accordingly
   */
  InvalidSession,
  /**
   * Sent immediately after connecting, contains the `heartbeat_interval` to use
   */
  Hello,
  /**
   * Sent in response to receiving a heartbeat to acknowledge that it has been received
   */
  HeartbeatAck,
  /**
   * Request information about soundboard sounds in a set of guilds
   */
  RequestSoundboardSounds = 31,
}

/**
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-close-event-codes}
 */
export enum GatewayCloseCodes {
  /**
   * We're not sure what went wrong. Try reconnecting?
   */
  UnknownError = 4_000,
  /**
   * You sent an invalid Gateway opcode or an invalid payload for an opcode. Don't do that!
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#payload-structure}
   */
  UnknownOpcode,
  /**
   * You sent an invalid payload to us. Don't do that!
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway#sending-events}
   */
  DecodeError,
  /**
   * You sent us a payload prior to identifying
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#identify}
   */
  NotAuthenticated,
  /**
   * The account token sent with your identify payload is incorrect
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#identify}
   */
  AuthenticationFailed,
  /**
   * You sent more than one identify payload. Don't do that!
   */
  AlreadyAuthenticated,
  /**
   * The sequence sent when resuming the session was invalid. Reconnect and start a new session
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#resume}
   */
  InvalidSeq = 4_007,
  /**
   * Woah nelly! You're sending payloads to us too quickly. Slow it down! You will be disconnected on receiving this
   */
  RateLimited,
  /**
   * Your session timed out. Reconnect and start a new one
   */
  SessionTimedOut,
  /**
   * You sent us an invalid shard when identifying
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway#sharding}
   */
  InvalidShard,
  /**
   * The session would have handled too many guilds - you are required to shard your connection in order to connect
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway#sharding}
   */
  ShardingRequired,
  /**
   * You sent an invalid version for the gateway
   */
  InvalidAPIVersion,
  /**
   * You sent an invalid intent for a Gateway Intent. You may have incorrectly calculated the bitwise value
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway#gateway-intents}
   */
  InvalidIntents,
  /**
   * You sent a disallowed intent for a Gateway Intent. You may have tried to specify an intent that you have not
   * enabled or are not whitelisted for
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway#gateway-intents}
   * @see {@link https://discord.com/developers/docs/topics/gateway#privileged-intents}
   */
  DisallowedIntents,
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway#list-of-intents}
 */
export const GatewayIntentBits = {
  Guilds: 1 << 0,
  GuildMembers: 1 << 1,
  GuildModeration: 1 << 2,
  GuildExpressions: 1 << 3,
  GuildIntegrations: 1 << 4,
  GuildWebhooks: 1 << 5,
  GuildInvites: 1 << 6,
  GuildVoiceStates: 1 << 7,
  GuildPresences: 1 << 8,
  GuildMessages: 1 << 9,
  GuildMessageReactions: 1 << 10,
  GuildMessageTyping: 1 << 11,
  DirectMessages: 1 << 12,
  DirectMessageReactions: 1 << 13,
  DirectMessageTyping: 1 << 14,
  MessageContent: 1 << 15,
  GuildScheduledEvents: 1 << 16,
  AutoModerationConfiguration: 1 << 20,
  AutoModerationExecution: 1 << 21,
  GuildMessagePolls: 1 << 24,
  DirectMessagePolls: 1 << 25,
} as const
export type GatewayIntentBits =
  (typeof GatewayIntentBits)[keyof typeof GatewayIntentBits]

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#receive-events}
 */
export enum GatewayDispatchEvents {
  ApplicationCommandPermissionsUpdate = "APPLICATION_COMMAND_PERMISSIONS_UPDATE",
  AutoModerationActionExecution = "AUTO_MODERATION_ACTION_EXECUTION",
  AutoModerationRuleCreate = "AUTO_MODERATION_RULE_CREATE",
  AutoModerationRuleDelete = "AUTO_MODERATION_RULE_DELETE",
  AutoModerationRuleUpdate = "AUTO_MODERATION_RULE_UPDATE",
  ChannelCreate = "CHANNEL_CREATE",
  ChannelDelete = "CHANNEL_DELETE",
  ChannelPinsUpdate = "CHANNEL_PINS_UPDATE",
  ChannelUpdate = "CHANNEL_UPDATE",
  EntitlementCreate = "ENTITLEMENT_CREATE",
  EntitlementDelete = "ENTITLEMENT_DELETE",
  EntitlementUpdate = "ENTITLEMENT_UPDATE",
  GuildAuditLogEntryCreate = "GUILD_AUDIT_LOG_ENTRY_CREATE",
  GuildBanAdd = "GUILD_BAN_ADD",
  GuildBanRemove = "GUILD_BAN_REMOVE",
  GuildCreate = "GUILD_CREATE",
  GuildDelete = "GUILD_DELETE",
  GuildEmojisUpdate = "GUILD_EMOJIS_UPDATE",
  GuildIntegrationsUpdate = "GUILD_INTEGRATIONS_UPDATE",
  GuildMemberAdd = "GUILD_MEMBER_ADD",
  GuildMemberRemove = "GUILD_MEMBER_REMOVE",
  GuildMembersChunk = "GUILD_MEMBERS_CHUNK",
  GuildMemberUpdate = "GUILD_MEMBER_UPDATE",
  GuildRoleCreate = "GUILD_ROLE_CREATE",
  GuildRoleDelete = "GUILD_ROLE_DELETE",
  GuildRoleUpdate = "GUILD_ROLE_UPDATE",
  GuildScheduledEventCreate = "GUILD_SCHEDULED_EVENT_CREATE",
  GuildScheduledEventDelete = "GUILD_SCHEDULED_EVENT_DELETE",
  GuildScheduledEventUpdate = "GUILD_SCHEDULED_EVENT_UPDATE",
  GuildScheduledEventUserAdd = "GUILD_SCHEDULED_EVENT_USER_ADD",
  GuildScheduledEventUserRemove = "GUILD_SCHEDULED_EVENT_USER_REMOVE",
  GuildSoundboardSoundCreate = "GUILD_SOUNDBOARD_SOUND_CREATE",
  GuildSoundboardSoundDelete = "GUILD_SOUNDBOARD_SOUND_DELETE",
  GuildSoundboardSoundsUpdate = "GUILD_SOUNDBOARD_SOUNDS_UPDATE",
  GuildSoundboardSoundUpdate = "GUILD_SOUNDBOARD_SOUND_UPDATE",
  SoundboardSounds = "SOUNDBOARD_SOUNDS",
  GuildStickersUpdate = "GUILD_STICKERS_UPDATE",
  GuildUpdate = "GUILD_UPDATE",
  IntegrationCreate = "INTEGRATION_CREATE",
  IntegrationDelete = "INTEGRATION_DELETE",
  IntegrationUpdate = "INTEGRATION_UPDATE",
  InteractionCreate = "INTERACTION_CREATE",
  InviteCreate = "INVITE_CREATE",
  InviteDelete = "INVITE_DELETE",
  MessageCreate = "MESSAGE_CREATE",
  MessageDelete = "MESSAGE_DELETE",
  MessageDeleteBulk = "MESSAGE_DELETE_BULK",
  MessagePollVoteAdd = "MESSAGE_POLL_VOTE_ADD",
  MessagePollVoteRemove = "MESSAGE_POLL_VOTE_REMOVE",
  MessageReactionAdd = "MESSAGE_REACTION_ADD",
  MessageReactionRemove = "MESSAGE_REACTION_REMOVE",
  MessageReactionRemoveAll = "MESSAGE_REACTION_REMOVE_ALL",
  MessageReactionRemoveEmoji = "MESSAGE_REACTION_REMOVE_EMOJI",
  MessageUpdate = "MESSAGE_UPDATE",
  PresenceUpdate = "PRESENCE_UPDATE",
  Ready = "READY",
  Resumed = "RESUMED",
  StageInstanceCreate = "STAGE_INSTANCE_CREATE",
  StageInstanceDelete = "STAGE_INSTANCE_DELETE",
  StageInstanceUpdate = "STAGE_INSTANCE_UPDATE",
  SubscriptionCreate = "SUBSCRIPTION_CREATE",
  SubscriptionDelete = "SUBSCRIPTION_DELETE",
  SubscriptionUpdate = "SUBSCRIPTION_UPDATE",
  ThreadCreate = "THREAD_CREATE",
  ThreadDelete = "THREAD_DELETE",
  ThreadListSync = "THREAD_LIST_SYNC",
  ThreadMembersUpdate = "THREAD_MEMBERS_UPDATE",
  ThreadMemberUpdate = "THREAD_MEMBER_UPDATE",
  ThreadUpdate = "THREAD_UPDATE",
  TypingStart = "TYPING_START",
  UserUpdate = "USER_UPDATE",
  VoiceChannelEffectSend = "VOICE_CHANNEL_EFFECT_SEND",
  VoiceServerUpdate = "VOICE_SERVER_UPDATE",
  VoiceStateUpdate = "VOICE_STATE_UPDATE",
  WebhooksUpdate = "WEBHOOKS_UPDATE",
}

export type GatewaySendPayload =
  | GatewayHeartbeat
  | GatewayIdentify
  | GatewayRequestGuildMembers
  | GatewayRequestSoundboardSounds
  | GatewayResume
  | GatewayUpdatePresence
  | GatewayVoiceStateUpdate

export type GatewayReceivePayload =
  | GatewayDispatchPayload
  | GatewayHeartbeatAck
  | GatewayHeartbeatRequest
  | GatewayHello
  | GatewayInvalidSession
  | GatewayReconnect

export type GatewayDispatchPayload =
  | GatewayApplicationCommandPermissionsUpdateDispatch
  | GatewayAutoModerationActionExecutionDispatch
  | GatewayAutoModerationRuleCreateDispatch
  | GatewayAutoModerationRuleDeleteDispatch
  | GatewayAutoModerationRuleModifyDispatch
  | GatewayChannelModifyDispatch
  | GatewayChannelPinsUpdateDispatch
  | GatewayEntitlementModifyDispatch
  | GatewayGuildAuditLogEntryCreateDispatch
  | GatewayGuildBanModifyDispatch
  | GatewayGuildCreateDispatch
  | GatewayGuildDeleteDispatch
  | GatewayGuildEmojisUpdateDispatch
  | GatewayGuildIntegrationsUpdateDispatch
  | GatewayGuildMemberAddDispatch
  | GatewayGuildMemberRemoveDispatch
  | GatewayGuildMembersChunkDispatch
  | GatewayGuildMemberUpdateDispatch
  | GatewayGuildModifyDispatch
  | GatewayGuildRoleCreateDispatch
  | GatewayGuildRoleDeleteDispatch
  | GatewayGuildRoleModifyDispatch
  | GatewayGuildScheduledEventCreateDispatch
  | GatewayGuildScheduledEventDeleteDispatch
  | GatewayGuildScheduledEventUpdateDispatch
  | GatewayGuildScheduledEventUserAddDispatch
  | GatewayGuildScheduledEventUserRemoveDispatch
  | GatewayGuildSoundboardSoundCreateDispatch
  | GatewayGuildSoundboardSoundDeleteDispatch
  | GatewayGuildSoundboardSoundsUpdateDispatch
  | GatewayGuildSoundboardSoundUpdateDispatch
  | GatewayGuildStickersUpdateDispatch
  | GatewayIntegrationCreateDispatch
  | GatewayIntegrationDeleteDispatch
  | GatewayIntegrationUpdateDispatch
  | GatewayInteractionCreateDispatch
  | GatewayInviteCreateDispatch
  | GatewayInviteDeleteDispatch
  | GatewayMessageCreateDispatch
  | GatewayMessageDeleteBulkDispatch
  | GatewayMessageDeleteDispatch
  | GatewayMessagePollVoteAddDispatch
  | GatewayMessagePollVoteRemoveDispatch
  | GatewayMessageReactionAddDispatch
  | GatewayMessageReactionRemoveAllDispatch
  | GatewayMessageReactionRemoveDispatch
  | GatewayMessageReactionRemoveEmojiDispatch
  | GatewayMessageUpdateDispatch
  | GatewayPresenceUpdateDispatch
  | GatewayReadyDispatch
  | GatewayResumedDispatch
  | GatewaySoundboardSoundsDispatch
  | GatewayStageInstanceCreateDispatch
  | GatewayStageInstanceDeleteDispatch
  | GatewayStageInstanceUpdateDispatch
  | GatewaySubscriptionModifyDispatch
  | GatewayThreadCreateDispatch
  | GatewayThreadDeleteDispatch
  | GatewayThreadListSyncDispatch
  | GatewayThreadMembersUpdateDispatch
  | GatewayThreadMemberUpdateDispatch
  | GatewayThreadUpdateDispatch
  | GatewayTypingStartDispatch
  | GatewayUserUpdateDispatch
  | GatewayVoiceChannelEffectSendDispatch
  | GatewayVoiceServerUpdateDispatch
  | GatewayVoiceStateUpdateDispatch
  | GatewayWebhooksUpdateDispatch

// #region Dispatch Payloads

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#hello}
 */
export interface GatewayHello extends _NonDispatchPayload {
  op: GatewayOpcodes.Hello
  d: GatewayHelloData
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#hello}
 */
export interface GatewayHelloData {
  /**
   * The interval (in milliseconds) the client should heartbeat with
   */
  heartbeat_interval: number
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway#sending-heartbeats}
 */
export interface GatewayHeartbeatRequest extends _NonDispatchPayload {
  op: GatewayOpcodes.Heartbeat
  d: never
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#heartbeat}
 */
export interface GatewayHeartbeatAck extends _NonDispatchPayload {
  op: GatewayOpcodes.HeartbeatAck
  d: never
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#invalid-session}
 */
export interface GatewayInvalidSession extends _NonDispatchPayload {
  op: GatewayOpcodes.InvalidSession
  d: GatewayInvalidSessionData
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#invalid-session}
 */
export type GatewayInvalidSessionData = boolean

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#reconnect}
 */
export interface GatewayReconnect extends _NonDispatchPayload {
  op: GatewayOpcodes.Reconnect
  d: never
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#ready}
 */
export type GatewayReadyDispatch = _DataPayload<
  GatewayDispatchEvents.Ready,
  GatewayReadyDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#ready}
 */
export interface GatewayReadyDispatchData {
  /**
   * Gateway version
   *
   * @see {@link https://discord.com/developers/docs/reference#api-versioning}
   */
  v: number
  /**
   * Information about the user including email
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  user: APIUser
  /**
   * The guilds the user is in
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#unavailable-guild-object}
   */
  guilds: Array<APIUnavailableGuild>
  /**
   * Used for resuming connections
   */
  session_id: string
  /**
   * Gateway url for resuming connections
   */
  resume_gateway_url: string
  /**
   * The shard information associated with this session, if sent when identifying
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway#sharding}
   */
  shard?: [shard_id: number, shard_count: number]
  /**
   * Contains `id` and `flags`
   *
   * @see {@link https://discord.com/developers/docs/resources/application#application-object}
   */
  application: Pick<APIApplication, "flags" | "id">
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#resumed}
 */
export type GatewayResumedDispatch = _DataPayload<
  GatewayDispatchEvents.Resumed,
  never
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-update}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-delete}
 */
export type GatewayAutoModerationRuleModifyDispatch = _DataPayload<
  | GatewayDispatchEvents.AutoModerationRuleCreate
  | GatewayDispatchEvents.AutoModerationRuleDelete
  | GatewayDispatchEvents.AutoModerationRuleUpdate,
  GatewayAutoModerationRuleModifyDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-update}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-delete}
 */
export type GatewayAutoModerationRuleModifyDispatchData = APIAutoModerationRule

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-create}
 */
export type GatewayAutoModerationRuleCreateDispatch =
  GatewayAutoModerationRuleModifyDispatch

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-create}
 */
export type GatewayAutoModerationRuleCreateDispatchData =
  GatewayAutoModerationRuleModifyDispatchData

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-update}
 */
export type GatewayAutoModerationRuleUpdateDispatch =
  GatewayAutoModerationRuleModifyDispatch

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-update}
 */
export type GatewayAutoModerationRuleUpdateDispatchData =
  GatewayAutoModerationRuleModifyDispatchData

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-delete}
 */
export type GatewayAutoModerationRuleDeleteDispatch =
  GatewayAutoModerationRuleModifyDispatch

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-delete}
 */
export type GatewayAutoModerationRuleDeleteDispatchData =
  GatewayAutoModerationRuleModifyDispatchData

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-action-execution}
 */
export type GatewayAutoModerationActionExecutionDispatch = _DataPayload<
  GatewayDispatchEvents.AutoModerationActionExecution,
  GatewayAutoModerationActionExecutionDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-action-execution}
 */
export interface GatewayAutoModerationActionExecutionDispatchData {
  /**
   * The id of the guild in which action was executed
   */
  guild_id: Snowflake
  /**
   * The action which was executed
   */
  action: APIAutoModerationAction
  /**
   * The id of the rule which action belongs to
   */
  rule_id: Snowflake
  /**
   * The trigger type of rule which was triggered
   */
  rule_trigger_type: AutoModerationRuleTriggerType
  /**
   * The id of the user which generated the content which triggered the rule
   */
  user_id: Snowflake
  /**
   * The id of the channel in which user content was posted
   */
  channel_id?: Snowflake
  /**
   * The id of any user message which content belongs to
   *
   * This field will not be present if message was blocked by AutoMod or content was not part of any message
   */
  message_id?: Snowflake
  /**
   * The id of any system auto moderation messages posted as a result of this action
   *
   * This field will not be present if this event does not correspond to an action with type {@link AutoModerationActionType.SendAlertMessage}
   */
  alert_system_message_id?: Snowflake
  /**
   * The user generated text content
   *
   * `MESSAGE_CONTENT` (`1 << 15`) gateway intent is required to receive non-empty values from this field
   */
  content: string
  /**
   * The word or phrase configured in the rule that triggered the rule
   */
  matched_keyword: string | null
  /**
   * The substring in content that triggered the rule
   *
   * `MESSAGE_CONTENT` (`1 << 15`) gateway intent is required to receive non-empty values from this field
   */
  matched_content: string | null
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#application-command-permissions-update}
 */
export type GatewayApplicationCommandPermissionsUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.ApplicationCommandPermissionsUpdate,
  GatewayApplicationCommandPermissionsUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#application-command-permissions-update}
 */
export interface GatewayApplicationCommandPermissionsUpdateDispatchData {
  /**
   * ID of the command or the application ID
   */
  id: Snowflake
  /**
   * ID of the application the command belongs to
   */
  application_id: Snowflake
  /**
   * ID of the guild
   */
  guild_id: Snowflake
  /**
   * Permissions for the command in the guild, max of 100
   */
  permissions: Array<APIApplicationCommandPermission>
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-update}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-delete}
 */
export type GatewaySubscriptionModifyDispatch = _DataPayload<
  | GatewayDispatchEvents.SubscriptionCreate
  | GatewayDispatchEvents.SubscriptionDelete
  | GatewayDispatchEvents.SubscriptionUpdate,
  GatewaySubscriptionModifyDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-update}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-delete}
 */
export type GatewaySubscriptionModifyDispatchData = APISubscription

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-create}
 */
export type GatewaySubscriptionCreateDispatch =
  GatewaySubscriptionModifyDispatch

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-create}
 */
export type GatewaySubscriptionCreateDispatchData =
  GatewaySubscriptionModifyDispatchData

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-update}
 */
export type GatewaySubscriptionUpdateDispatch =
  GatewaySubscriptionModifyDispatch

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-update}
 */
export type GatewaySubscriptionUpdateDispatchData =
  GatewaySubscriptionModifyDispatchData

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-delete}
 */
export type GatewaySubscriptionDeleteDispatch =
  GatewaySubscriptionModifyDispatch

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-delete}
 */
export type GatewaySubscriptionDeleteDispatchData =
  GatewaySubscriptionModifyDispatchData

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-update}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-delete}
 */
export type GatewayChannelModifyDispatch = _DataPayload<
  | GatewayDispatchEvents.ChannelCreate
  | GatewayDispatchEvents.ChannelDelete
  | GatewayDispatchEvents.ChannelUpdate,
  GatewayChannelModifyDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-update}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-delete}
 */
export type GatewayChannelModifyDispatchData = APIChannel & {
  type: Exclude<GuildChannelType, ThreadChannelType>
  guild_id: Snowflake
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-create}
 */
export type GatewayChannelCreateDispatch = GatewayChannelModifyDispatch

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-create}
 */
export type GatewayChannelCreateDispatchData = GatewayChannelModifyDispatchData

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-update}
 */
export type GatewayChannelUpdateDispatch = GatewayChannelModifyDispatch

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-update}
 */
export type GatewayChannelUpdateDispatchData = GatewayChannelModifyDispatchData

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-delete}
 */
export type GatewayChannelDeleteDispatch = GatewayChannelModifyDispatch

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-delete}
 */
export type GatewayChannelDeleteDispatchData = GatewayChannelModifyDispatchData

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-pins-update}
 */
export type GatewayChannelPinsUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.ChannelPinsUpdate,
  GatewayChannelPinsUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-pins-update}
 */
export interface GatewayChannelPinsUpdateDispatchData {
  /**
   * The id of the guild
   */
  guild_id?: Snowflake
  /**
   * The id of the channel
   */
  channel_id: Snowflake
  /**
   * The time at which the most recent pinned message was pinned
   */
  last_pin_timestamp?: string | null
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-update}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-delete}
 */
export type GatewayEntitlementModifyDispatchData = APIEntitlement

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-update}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-delete}
 */
export type GatewayEntitlementModifyDispatch = _DataPayload<
  | GatewayDispatchEvents.EntitlementCreate
  | GatewayDispatchEvents.EntitlementDelete
  | GatewayDispatchEvents.EntitlementUpdate,
  GatewayEntitlementModifyDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-create}
 */
export type GatewayEntitlementCreateDispatchData = Omit<
  GatewayEntitlementModifyDispatchData,
  "ends_at"
> & {
  ends_at: GatewayEntitlementModifyDispatchData["ends_at"] | null
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-create}
 */
export type GatewayEntitlementCreateDispatch = GatewayEntitlementModifyDispatch

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-update}
 */
export type GatewayEntitlementUpdateDispatchData =
  GatewayEntitlementModifyDispatchData

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-update}
 */
export type GatewayEntitlementUpdateDispatch = GatewayEntitlementModifyDispatch

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-delete}
 */
export type GatewayEntitlementDeleteDispatchData =
  GatewayEntitlementModifyDispatchData

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-delete}
 */
export type GatewayEntitlementDeleteDispatch = GatewayEntitlementModifyDispatch

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-update}
 */
export type GatewayGuildModifyDispatch = _DataPayload<
  GatewayDispatchEvents.GuildUpdate,
  GatewayGuildModifyDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-update}
 */
export type GatewayGuildModifyDispatchData = APIGuild

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-create}
 */
export type GatewayGuildCreateDispatch = _DataPayload<
  GatewayDispatchEvents.GuildCreate,
  GatewayGuildCreateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-create-guild-create-extra-fields}
 */
export interface GatewayGuildCreateDispatchData extends APIGuild {
  /**
   * When this guild was joined at
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   */
  joined_at: string
  /**
   * `true` if this is considered a large guild
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   */
  large: boolean
  /**
   * `true` if this guild is unavailable due to an outage
   */
  unavailable?: boolean
  /**
   * Total number of members in this guild
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   */
  member_count: number
  /**
   * States of members currently in voice channels; lacks the `guild_id` key
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   *
   * @see {@link https://discord.com/developers/docs/resources/voice#voice-state-object}
   */
  voice_states: Array<Omit<APIVoiceState, "guild_id">>
  /**
   * Users in the guild
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
   */
  members: Array<APIGuildMember>
  /**
   * Channels in the guild
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   *
   * @see {@link https://discord.com/developers/docs/resources/channel#channel-object}
   */
  channels: Array<
    APIChannel & {
      type: Exclude<GuildChannelType, ThreadChannelType>
    }
  >
  /**
   * Threads in the guild
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   *
   * @see {@link https://discord.com/developers/docs/resources/channel#channel-object}
   */
  threads: Array<APIChannel & { type: ThreadChannelType }>
  /**
   * Presences of the members in the guild, will only include non-offline members if the size is greater than `large_threshold`
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#presence-update}
   */
  presences: Array<GatewayPresenceUpdate>
  /**
   * The stage instances in the guild
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   *
   * @see {@link https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-stage-instance-structure}
   */
  stage_instances: Array<APIStageInstance>
  /**
   * The scheduled events in the guild
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   *
   * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object}
   */
  guild_scheduled_events: Array<APIGuildScheduledEvent>
  /**
   * The soundboard sounds in the guild
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   *
   * @see {@link https://discord.com/developers/docs/resources/soundboard#soundboard-sound-object}
   */
  soundboard_sounds: Array<APISoundboardSound>
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-update}
 */
export type GatewayGuildUpdateDispatch = GatewayGuildModifyDispatch

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-update}
 */
export type GatewayGuildUpdateDispatchData = GatewayGuildModifyDispatchData

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-delete}
 */
export type GatewayGuildDeleteDispatch = _DataPayload<
  GatewayDispatchEvents.GuildDelete,
  GatewayGuildDeleteDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-delete}
 */
export interface GatewayGuildDeleteDispatchData extends Omit<
  APIUnavailableGuild,
  "unavailable"
> {
  /**
   * `true` if this guild is unavailable due to an outage
   *
   * If the field is not set, the user was removed from the guild.
   */
  unavailable?: true
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-ban-add}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-ban-remove}
 */
export type GatewayGuildBanModifyDispatch = _DataPayload<
  GatewayDispatchEvents.GuildBanAdd | GatewayDispatchEvents.GuildBanRemove,
  GatewayGuildBanModifyDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-ban-add}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-ban-remove}
 */
export interface GatewayGuildBanModifyDispatchData {
  /**
   * ID of the guild
   */
  guild_id: Snowflake
  /**
   * The banned user
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  user: APIUser
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-ban-add}
 */
export type GatewayGuildBanAddDispatch = GatewayGuildBanModifyDispatch

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-ban-add}
 */
export type GatewayGuildBanAddDispatchData = GatewayGuildBanModifyDispatchData

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-ban-remove}
 */
export type GatewayGuildBanRemoveDispatch = GatewayGuildBanModifyDispatch

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-ban-remove}
 */
export type GatewayGuildBanRemoveDispatchData =
  GatewayGuildBanModifyDispatchData

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-emojis-update}
 */
export type GatewayGuildEmojisUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.GuildEmojisUpdate,
  GatewayGuildEmojisUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-emojis-update}
 */
export interface GatewayGuildEmojisUpdateDispatchData {
  /**
   * ID of the guild
   */
  guild_id: Snowflake
  /**
   * Array of emojis
   *
   * @see {@link https://discord.com/developers/docs/resources/emoji#emoji-object}
   */
  emojis: Array<APIEmoji>
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-stickers-update}
 */
export type GatewayGuildStickersUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.GuildStickersUpdate,
  GatewayGuildStickersUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-stickers-update}
 */
export interface GatewayGuildStickersUpdateDispatchData {
  /**
   * ID of the guild
   */
  guild_id: Snowflake
  /**
   * Array of stickers
   *
   * @see {@link https://discord.com/developers/docs/resources/sticker#sticker-object}
   */
  stickers: Array<APISticker>
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-integrations-update}
 */
export type GatewayGuildIntegrationsUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.GuildIntegrationsUpdate,
  GatewayGuildIntegrationsUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-integrations-update}
 */
export interface GatewayGuildIntegrationsUpdateDispatchData {
  /**
   * ID of the guild whose integrations were updated
   */
  guild_id: Snowflake
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-member-add}
 */
export type GatewayGuildMemberAddDispatch = _DataPayload<
  GatewayDispatchEvents.GuildMemberAdd,
  GatewayGuildMemberAddDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-member-add}
 */
export interface GatewayGuildMemberAddDispatchData extends APIGuildMember {
  /**
   * The id of the guild
   */
  guild_id: Snowflake
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-member-remove}
 */
export type GatewayGuildMemberRemoveDispatch = _DataPayload<
  GatewayDispatchEvents.GuildMemberRemove,
  GatewayGuildMemberRemoveDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-member-remove}
 */
export interface GatewayGuildMemberRemoveDispatchData {
  /**
   * The id of the guild
   */
  guild_id: Snowflake
  /**
   * The user who was removed
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  user: APIUser
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-member-update}
 */
export type GatewayGuildMemberUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.GuildMemberUpdate,
  GatewayGuildMemberUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-member-update}
 */
export type GatewayGuildMemberUpdateDispatchData = _Nullable<
  Pick<APIGuildMember, "joined_at">
> &
  Omit<APIGuildMember, "deaf" | "flags" | "joined_at" | "mute" | "user"> &
  Partial<Pick<APIGuildMember, "deaf" | "flags" | "mute">> &
  Required<Pick<APIGuildMember, "avatar" | "banner" | "user">> & {
    /**
     * The id of the guild
     */
    guild_id: Snowflake
  }

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-members-chunk}
 */
export type GatewayGuildMembersChunkDispatch = _DataPayload<
  GatewayDispatchEvents.GuildMembersChunk,
  GatewayGuildMembersChunkDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-presence}
 */
export type GatewayGuildMembersChunkPresence = Omit<
  RawGatewayPresenceUpdate,
  "guild_id"
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-members-chunk}
 */
export interface GatewayGuildMembersChunkDispatchData {
  /**
   * The id of the guild
   */
  guild_id: Snowflake
  /**
   * Set of guild members
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
   */
  members: Array<APIGuildMember>
  /**
   * The chunk index in the expected chunks for this response (`0 <= chunk_index < chunk_count`)
   */
  chunk_index: number
  /**
   * The total number of expected chunks for this response
   */
  chunk_count: number
  /**
   * If passing an invalid id to `REQUEST_GUILD_MEMBERS`, it will be returned here
   */
  not_found?: Array<unknown>
  /**
   * If passing true to `REQUEST_GUILD_MEMBERS`, presences of the returned members will be here
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-presence}
   */
  presences?: Array<GatewayGuildMembersChunkPresence>
  /**
   * The nonce used in the Guild Members Request
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-guild-members}
   */
  nonce?: string
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-update}
 */
export type GatewayGuildRoleModifyDispatch = _DataPayload<
  GatewayDispatchEvents.GuildRoleCreate | GatewayDispatchEvents.GuildRoleUpdate,
  GatewayGuildRoleModifyDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-update}
 */
export interface GatewayGuildRoleModifyDispatchData {
  /**
   * The id of the guild
   */
  guild_id: Snowflake
  /**
   * The role created or updated
   *
   * @see {@link https://discord.com/developers/docs/topics/permissions#role-object}
   */
  role: APIRole
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-create}
 */
export type GatewayGuildRoleCreateDispatch = GatewayGuildRoleModifyDispatch

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-create}
 */
export type GatewayGuildRoleCreateDispatchData =
  GatewayGuildRoleModifyDispatchData

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-update}
 */
export type GatewayGuildRoleUpdateDispatch = GatewayGuildRoleModifyDispatch

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-update}
 */
export type GatewayGuildRoleUpdateDispatchData =
  GatewayGuildRoleModifyDispatchData

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-delete}
 */
export type GatewayGuildRoleDeleteDispatch = _DataPayload<
  GatewayDispatchEvents.GuildRoleDelete,
  GatewayGuildRoleDeleteDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-delete}
 */
export interface GatewayGuildRoleDeleteDispatchData {
  /**
   * The id of the guild
   */
  guild_id: Snowflake
  /**
   * The id of the role
   */
  role_id: Snowflake
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-create}
 */
export type GatewayGuildScheduledEventCreateDispatch = _DataPayload<
  GatewayDispatchEvents.GuildScheduledEventCreate,
  GatewayGuildScheduledEventCreateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-create}
 */
export type GatewayGuildScheduledEventCreateDispatchData =
  APIGuildScheduledEvent

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-update}
 */
export type GatewayGuildScheduledEventUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.GuildScheduledEventUpdate,
  GatewayGuildScheduledEventUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-update}
 */
export type GatewayGuildScheduledEventUpdateDispatchData =
  APIGuildScheduledEvent

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-delete}
 */
export type GatewayGuildScheduledEventDeleteDispatch = _DataPayload<
  GatewayDispatchEvents.GuildScheduledEventDelete,
  GatewayGuildScheduledEventDeleteDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-delete}
 */
export type GatewayGuildScheduledEventDeleteDispatchData =
  APIGuildScheduledEvent

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-user-add}
 */
export type GatewayGuildScheduledEventUserAddDispatch = _DataPayload<
  GatewayDispatchEvents.GuildScheduledEventUserAdd,
  GatewayGuildScheduledEventUserAddDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-user-add}
 */
export interface GatewayGuildScheduledEventUserAddDispatchData {
  guild_scheduled_event_id: Snowflake
  user_id: Snowflake
  guild_id: Snowflake
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-user-remove}
 */
export type GatewayGuildScheduledEventUserRemoveDispatch = _DataPayload<
  GatewayDispatchEvents.GuildScheduledEventUserRemove,
  GatewayGuildScheduledEventUserAddDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-user-remove}
 */
export interface GatewayGuildScheduledEventUserRemoveDispatchData {
  guild_scheduled_event_id: Snowflake
  user_id: Snowflake
  guild_id: Snowflake
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-soundboard-sound-create}
 */
export type GatewayGuildSoundboardSoundCreateDispatch = _DataPayload<
  GatewayDispatchEvents.GuildSoundboardSoundCreate,
  GatewayGuildSoundboardSoundCreateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-soundboard-sound-create}
 */
export type GatewayGuildSoundboardSoundCreateDispatchData = APISoundboardSound

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-soundboard-sound-update}
 */
export type GatewayGuildSoundboardSoundUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.GuildSoundboardSoundUpdate,
  GatewayGuildSoundboardSoundUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-soundboard-sound-update}
 */
export type GatewayGuildSoundboardSoundUpdateDispatchData = APISoundboardSound

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-soundboard-sound-delete}
 */
export type GatewayGuildSoundboardSoundDeleteDispatch = _DataPayload<
  GatewayDispatchEvents.GuildSoundboardSoundDelete,
  GatewayGuildSoundboardSoundDeleteDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-soundboard-sound-delete}
 */
export interface GatewayGuildSoundboardSoundDeleteDispatchData {
  /**
   * The id of the sound that was deleted
   */
  sound_id: Snowflake
  /**
   * The id of the guild the sound was in
   */
  guild_id: Snowflake
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-soundboard-sounds-update}
 */
export type GatewayGuildSoundboardSoundsUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.GuildSoundboardSoundsUpdate,
  GatewayGuildSoundboardSoundsUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-soundboard-sounds-update}
 */
export interface GatewayGuildSoundboardSoundsUpdateDispatchData {
  /**
   * The guild's soundboard sounds
   */
  soundboard_sounds: Array<APISoundboardSound>
  /**
   * The id of the guild
   */
  guild_id: Snowflake
}

/**
 * @see {@link https://discord.com/developers/docs/events/gateway-events#soundboard-sounds}
 */
export type GatewaySoundboardSoundsDispatch = _DataPayload<
  GatewayDispatchEvents.SoundboardSounds,
  GatewaySoundboardSoundsDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/events/gateway-events#soundboard-sounds}
 */
export interface GatewaySoundboardSoundsDispatchData {
  /**
   * The guild's soundboard sounds
   */
  soundboard_sounds: Array<APISoundboardSound>
  /**
   * The id of the guild
   */
  guild_id: Snowflake
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#integration-create}
 */
export type GatewayIntegrationCreateDispatch = _DataPayload<
  GatewayDispatchEvents.IntegrationCreate,
  GatewayIntegrationCreateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#integration-create}
 */
export type GatewayIntegrationCreateDispatchData = APIGuildIntegration & {
  guild_id: Snowflake
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#integration-update}
 */
export type GatewayIntegrationUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.IntegrationUpdate,
  GatewayIntegrationUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#integration-update}
 */
export type GatewayIntegrationUpdateDispatchData = APIGuildIntegration & {
  guild_id: Snowflake
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#integration-update}
 */
export type GatewayIntegrationDeleteDispatch = _DataPayload<
  GatewayDispatchEvents.IntegrationDelete,
  GatewayIntegrationDeleteDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#integration-delete}
 */
export interface GatewayIntegrationDeleteDispatchData {
  /**
   * Integration id
   */
  id: Snowflake
  /**
   * ID of the guild
   */
  guild_id: Snowflake
  /**
   * ID of the bot/OAuth2 application for this Discord integration
   */
  application_id?: Snowflake
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#interaction-create}
 */
export type GatewayInteractionCreateDispatch = _DataPayload<
  GatewayDispatchEvents.InteractionCreate,
  GatewayInteractionCreateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#interaction-create}
 */
export type GatewayInteractionCreateDispatchData = APIInteraction

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#invite-create}
 */
export type GatewayInviteCreateDispatch = _DataPayload<
  GatewayDispatchEvents.InviteCreate,
  GatewayInviteCreateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#invite-create}
 */
export interface GatewayInviteCreateDispatchData {
  /**
   * The channel the invite is for
   */
  channel_id: Snowflake
  /**
   * The unique invite code
   *
   * @see {@link https://discord.com/developers/docs/resources/invite#invite-object}
   */
  code: string
  /**
   * The time at which the invite was created
   */
  created_at: number
  /**
   * The guild of the invite
   */
  guild_id?: Snowflake
  /**
   * The user that created the invite
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  inviter?: APIUser
  /**
   * How long the invite is valid for (in seconds)
   */
  max_age: number
  /**
   * The maximum number of times the invite can be used
   */
  max_uses: number
  /**
   * The type of target for this voice channel invite
   *
   * @see {@link https://discord.com/developers/docs/resources/invite#invite-object-invite-target-types}
   */
  target_type?: InviteTargetType
  /**
   * The user whose stream to display for this voice channel stream invite
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  target_user?: APIUser
  /**
   * The embedded application to open for this voice channel embedded application invite
   */
  target_application?: Partial<APIApplication>
  /**
   * Whether or not the invite is temporary (invited users will be kicked on disconnect unless they're assigned a role)
   */
  temporary: boolean
  /**
   * How many times the invite has been used (always will be `0`)
   */
  uses: 0
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#invite-delete}
 */
export type GatewayInviteDeleteDispatch = _DataPayload<
  GatewayDispatchEvents.InviteDelete,
  GatewayInviteDeleteDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#invite-delete}
 */
export interface GatewayInviteDeleteDispatchData {
  /**
   * The channel of the invite
   */
  channel_id: Snowflake
  /**
   * The guild of the invite
   */
  guild_id?: Snowflake
  /**
   * The unique invite code
   *
   * @see {@link https://discord.com/developers/docs/resources/invite#invite-object}
   */
  code: string
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-create}
 */
export type GatewayMessageCreateDispatch = _DataPayload<
  GatewayDispatchEvents.MessageCreate,
  GatewayMessageCreateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-create}
 */
export type GatewayMessageCreateDispatchData = GatewayMessageEventExtraFields &
  Omit<APIMessage, "mentions">

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-update}
 */
export type GatewayMessageUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.MessageUpdate,
  GatewayMessageUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-update}
 */
export type GatewayMessageUpdateDispatchData = GatewayMessageEventExtraFields &
  Omit<APIMessage, "mentions">

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-create-message-create-extra-fields}
 */
export interface GatewayMessageEventExtraFields {
  /**
   * ID of the guild the message was sent in
   */
  guild_id?: Snowflake
  /**
   * Member properties for this message's author
   *
   * The member object exists in `MESSAGE_CREATE` and `MESSAGE_UPDATE` events
   * from text-based guild channels
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
   */
  member?: Omit<APIGuildMember, "user">
  /**
   * Users specifically mentioned in the message
   *
   * The `member` field is only present in `MESSAGE_CREATE` and `MESSAGE_UPDATE` events
   * from text-based guild channels
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
   */
  mentions: Array<APIUser & { member?: Omit<APIGuildMember, "user"> }>
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-delete}
 */
export type GatewayMessageDeleteDispatch = _DataPayload<
  GatewayDispatchEvents.MessageDelete,
  GatewayMessageDeleteDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-delete}
 */
export interface GatewayMessageDeleteDispatchData {
  /**
   * The id of the message
   */
  id: Snowflake
  /**
   * The id of the channel
   */
  channel_id: Snowflake
  /**
   * The id of the guild
   */
  guild_id?: Snowflake
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-delete-bulk}
 */
export type GatewayMessageDeleteBulkDispatch = _DataPayload<
  GatewayDispatchEvents.MessageDeleteBulk,
  GatewayMessageDeleteBulkDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-delete-bulk}
 */
export interface GatewayMessageDeleteBulkDispatchData {
  /**
   * The ids of the messages
   */
  ids: Array<Snowflake>
  /**
   * The id of the channel
   */
  channel_id: Snowflake
  /**
   * The id of the guild
   */
  guild_id?: Snowflake
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-add}
 */
export type GatewayMessageReactionAddDispatch =
  GatewayMessageReactionData<GatewayDispatchEvents.MessageReactionAdd>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-add}
 */
export type GatewayMessageReactionAddDispatchData =
  GatewayMessageReactionAddDispatch["d"]

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove}
 */
export type GatewayMessageReactionRemoveDispatch = GatewayMessageReactionData<
  GatewayDispatchEvents.MessageReactionRemove,
  "burst_colors" | "member" | "message_author_id"
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove}
 */
export type GatewayMessageReactionRemoveDispatchData =
  GatewayMessageReactionRemoveDispatch["d"]

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove-all}
 */
export type GatewayMessageReactionRemoveAllDispatch = _DataPayload<
  GatewayDispatchEvents.MessageReactionRemoveAll,
  GatewayMessageReactionRemoveAllDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove-all}
 */
export type GatewayMessageReactionRemoveAllDispatchData =
  GatewayMessageReactionRemoveData

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove-emoji}
 */
export type GatewayMessageReactionRemoveEmojiDispatch = _DataPayload<
  GatewayDispatchEvents.MessageReactionRemoveEmoji,
  GatewayMessageReactionRemoveEmojiDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove-emoji}
 */
export interface GatewayMessageReactionRemoveEmojiDispatchData extends GatewayMessageReactionRemoveData {
  /**
   * The emoji that was removed
   */
  emoji: APIEmoji
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#presence-update}
 */
export type GatewayPresenceUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.PresenceUpdate,
  GatewayPresenceUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#presence-update}
 */
export type GatewayPresenceUpdateDispatchData = RawGatewayPresenceUpdate

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#stage-instance-create}
 */
export type GatewayStageInstanceCreateDispatch = _DataPayload<
  GatewayDispatchEvents.StageInstanceCreate,
  GatewayStageInstanceCreateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#stage-instance-create}
 */
export type GatewayStageInstanceCreateDispatchData = APIStageInstance

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#stage-instance-delete}
 */
export type GatewayStageInstanceDeleteDispatch = _DataPayload<
  GatewayDispatchEvents.StageInstanceDelete,
  GatewayStageInstanceDeleteDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#stage-instance-delete}
 */
export type GatewayStageInstanceDeleteDispatchData = APIStageInstance

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#stage-instance-update}
 */
export type GatewayStageInstanceUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.StageInstanceUpdate,
  GatewayStageInstanceUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#stage-instance-update}
 */
export type GatewayStageInstanceUpdateDispatchData = APIStageInstance

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-list-sync}
 */
export type GatewayThreadListSyncDispatch = _DataPayload<
  GatewayDispatchEvents.ThreadListSync,
  GatewayThreadListSyncDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-list-sync}
 */
export type GatewayThreadListSyncDispatchData = RawGatewayThreadListSync

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-members-update}
 */
export type GatewayThreadMembersUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.ThreadMembersUpdate,
  GatewayThreadMembersUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-members-update}
 */
export type GatewayThreadMembersUpdateDispatchData =
  RawGatewayThreadMembersUpdate

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-member-update}
 */
export type GatewayThreadMemberUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.ThreadMemberUpdate,
  GatewayThreadMemberUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-member-update}
 */
export type GatewayThreadMemberUpdateDispatchData = APIThreadMember & {
  guild_id: Snowflake
}

/**
 * @deprecated This type doesn't accurately reflect the Discord API.
 * Use {@link GatewayThreadCreateDispatch},
 * {@link GatewayThreadUpdateDispatch}, or
 * {@link GatewayThreadDeleteDispatch} instead.
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-update}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-delete}
 */
export type GatewayThreadModifyDispatch = _DataPayload<
  | GatewayDispatchEvents.ThreadCreate
  | GatewayDispatchEvents.ThreadDelete
  | GatewayDispatchEvents.ThreadUpdate,
  APIThreadChannel
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-create}
 */
export type GatewayThreadCreateDispatch = _DataPayload<
  GatewayDispatchEvents.ThreadCreate,
  GatewayThreadCreateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-create}
 */
export interface GatewayThreadCreateDispatchData extends APIThreadChannel {
  /**
   * Whether the thread is newly created or not.
   */
  newly_created?: true
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-update}
 */
export type GatewayThreadUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.ThreadUpdate,
  GatewayThreadUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-update}
 */
export type GatewayThreadUpdateDispatchData = APIThreadChannel

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-delete}
 */
export type GatewayThreadDeleteDispatch = _DataPayload<
  GatewayDispatchEvents.ThreadDelete,
  GatewayThreadDeleteDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-delete}
 */
export interface GatewayThreadDeleteDispatchData {
  /**
   * The id of the channel
   */
  id: Snowflake
  /**
   * The id of the guild
   */
  guild_id: Snowflake
  /**
   * The id of the parent channel of the thread
   */
  parent_id: Snowflake
  /**
   * The type of the channel
   *
   * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-types}
   */
  type: ChannelType
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#typing-start}
 */
export type GatewayTypingStartDispatch = _DataPayload<
  GatewayDispatchEvents.TypingStart,
  GatewayTypingStartDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#typing-start}
 */
export interface GatewayTypingStartDispatchData {
  /**
   * The id of the channel
   */
  channel_id: Snowflake
  /**
   * The id of the guild
   */
  guild_id?: Snowflake
  /**
   * The id of the user
   */
  user_id: Snowflake
  /**
   * Unix time (in seconds) of when the user started typing
   */
  timestamp: number
  /**
   * The member who started typing if this happened in a guild
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
   */
  member?: APIGuildMember
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#user-update}
 */
export type GatewayUserUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.UserUpdate,
  GatewayUserUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#user-update}
 */
export type GatewayUserUpdateDispatchData = APIUser

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#voice-channel-effect-send}
 */
export type GatewayVoiceChannelEffectSendDispatch = _DataPayload<
  GatewayDispatchEvents.VoiceChannelEffectSend,
  GatewayVoiceChannelEffectSendDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#voice-channel-effect-send}
 */
export interface GatewayVoiceChannelEffectSendDispatchData {
  /**
   * ID of the channel the effect was sent in
   */
  channel_id: Snowflake
  /**
   * ID of the guild the effect was sent in
   */
  guild_id: Snowflake
  /**
   * ID of the user who sent the effect
   */
  user_id: Snowflake
  /**
   * The emoji sent, for emoji reaction and soundboard effects
   */
  emoji?: APIEmoji | null
  /**
   * The type of emoji animation, for emoji reaction and soundboard effects
   */
  animation_type?: VoiceChannelEffectSendAnimationType | null
  /**
   * The ID of the emoji animation, for emoji reaction and soundboard effects
   */
  animation_id?: number
  /**
   * The ID of the soundboard sound, for soundboard effects
   */
  sound_id?: Snowflake | number
  /**
   * The volume of the soundboard sound, from 0 to 1, for soundboard effects
   */
  sound_volume?: number
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#voice-channel-effect-send-animation-types}
 */
export enum VoiceChannelEffectSendAnimationType {
  /**
   * A fun animation, sent by a Nitro subscriber
   */
  Premium,
  /**
   * The standard animation
   */
  Basic,
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#voice-state-update}
 */
export type GatewayVoiceStateUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.VoiceStateUpdate,
  GatewayVoiceStateUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#voice-state-update}
 */
export type GatewayVoiceStateUpdateDispatchData = APIVoiceState

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#voice-server-update}
 */
export type GatewayVoiceServerUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.VoiceServerUpdate,
  GatewayVoiceServerUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#voice-server-update}
 */
export interface GatewayVoiceServerUpdateDispatchData {
  /**
   * Voice connection token
   */
  token: string
  /**
   * The guild this voice server update is for
   */
  guild_id: Snowflake
  /**
   * The voice server host
   *
   * A `null` endpoint means that the voice server allocated has gone away and is trying to be reallocated.
   * You should attempt to disconnect from the currently connected voice server, and not attempt to reconnect
   * until a new voice server is allocated
   */
  endpoint: string | null
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#webhooks-update}
 */
export type GatewayWebhooksUpdateDispatch = _DataPayload<
  GatewayDispatchEvents.WebhooksUpdate,
  GatewayWebhooksUpdateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#webhooks-update}
 */
export interface GatewayWebhooksUpdateDispatchData {
  /**
   * The id of the guild
   */
  guild_id: Snowflake
  /**
   * The id of the channel
   */
  channel_id: Snowflake
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-audit-log-entry-create}
 */
export type GatewayGuildAuditLogEntryCreateDispatch = _DataPayload<
  GatewayDispatchEvents.GuildAuditLogEntryCreate,
  GatewayGuildAuditLogEntryCreateDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-audit-log-entry-create}
 */
export interface GatewayGuildAuditLogEntryCreateDispatchData extends APIAuditLogEntry {
  /**
   * ID of the guild
   */
  guild_id: Snowflake
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-poll-vote-add}
 */
export type GatewayMessagePollVoteAddDispatch = _DataPayload<
  GatewayDispatchEvents.MessagePollVoteAdd,
  GatewayMessagePollVoteDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-poll-vote-remove}
 */
export type GatewayMessagePollVoteRemoveDispatch = _DataPayload<
  GatewayDispatchEvents.MessagePollVoteRemove,
  GatewayMessagePollVoteDispatchData
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-poll-vote-add}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-poll-vote-remove}
 */
export interface GatewayMessagePollVoteDispatchData {
  /**
   * ID of the user
   */
  user_id: Snowflake
  /**
   * ID of the channel
   */
  channel_id: Snowflake
  /**
   * ID of the message
   */
  message_id: Snowflake
  /**
   * ID of the guild
   */
  guild_id?: Snowflake
  /**
   * ID of the answer
   */
  answer_id: number
}

// #endregion Dispatch Payloads

// #region Sendable Payloads

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway#sending-heartbeats}
 */
export interface GatewayHeartbeat {
  op: GatewayOpcodes.Heartbeat
  d: GatewayHeartbeatData
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway#sending-heartbeats}
 */
export type GatewayHeartbeatData = number | null

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#identify}
 */
export interface GatewayIdentify {
  op: GatewayOpcodes.Identify
  d: GatewayIdentifyData
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#identify}
 */
export interface GatewayIdentifyData {
  /**
   * Authentication token
   */
  token: string
  /**
   * Connection properties
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#identify-identify-connection-properties}
   */
  properties: GatewayIdentifyProperties
  /**
   * Whether this connection supports compression of packets
   *
   * @defaultValue `false`
   */
  compress?: boolean
  /**
   * Value between 50 and 250, total number of members where the gateway will stop sending
   * offline members in the guild member list
   *
   * @defaultValue `50`
   */
  large_threshold?: number
  /**
   * Used for Guild Sharding
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway#sharding}
   */
  shard?: [shard_id: number, shard_count: number]
  /**
   * Presence structure for initial presence information
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-presence}
   */
  presence?: GatewayPresenceUpdateData
  /**
   * The Gateway Intents you wish to receive
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway#gateway-intents}
   */
  intents: number
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#identify-identify-connection-properties}
 */
export interface GatewayIdentifyProperties {
  /**
   * Your operating system
   */
  os: string
  /**
   * Your library name
   */
  browser: string
  /**
   * Your library name
   */
  device: string
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#resume}
 */
export interface GatewayResume {
  op: GatewayOpcodes.Resume
  d: GatewayResumeData
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#resume}
 */
export interface GatewayResumeData {
  /**
   * Session token
   */
  token: string
  /**
   * Session id
   */
  session_id: string
  /**
   * Last sequence number received
   */
  seq: number
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-guild-members}
 */
export interface GatewayRequestGuildMembers {
  op: GatewayOpcodes.RequestGuildMembers
  d: GatewayRequestGuildMembersData
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-guild-members}
 */
export interface GatewayRequestGuildMembersDataBase {
  /**
   * ID of the guild to get members for
   */
  guild_id: Snowflake
  /**
   * Used to specify if we want the presences of the matched members
   */
  presences?: boolean
  /**
   * Nonce to identify the Guild Members Chunk response
   *
   * Nonce can only be up to 32 bytes. If you send an invalid nonce it will be ignored and the reply member_chunk(s) will not have a `nonce` set.
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-members-chunk}
   */
  nonce?: string
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-guild-members}
 */
export interface GatewayRequestGuildMembersDataWithUserIds extends GatewayRequestGuildMembersDataBase {
  /**
   * Used to specify which users you wish to fetch
   */
  user_ids: Snowflake | Array<Snowflake>
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-guild-members}
 */
export interface GatewayRequestGuildMembersDataWithQuery extends GatewayRequestGuildMembersDataBase {
  /**
   * String that username starts with, or an empty string to return all members
   */
  query: string
  /**
   * Maximum number of members to send matching the `query`;
   * a limit of `0` can be used with an empty string `query` to return all members
   */
  limit: number
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-guild-members}
 */
export type GatewayRequestGuildMembersData =
  | GatewayRequestGuildMembersDataWithQuery
  | GatewayRequestGuildMembersDataWithUserIds

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-soundboard-sounds}
 */
export interface GatewayRequestSoundboardSounds {
  op: GatewayOpcodes.RequestSoundboardSounds
  d: GatewayRequestSoundboardSoundsData
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-soundboard-sounds}
 */
export interface GatewayRequestSoundboardSoundsData {
  /**
   * The ids of the guilds to get soundboard sounds for
   */
  guild_ids: Array<Snowflake>
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-voice-state}
 */
export interface GatewayVoiceStateUpdate {
  op: GatewayOpcodes.VoiceStateUpdate
  d: GatewayVoiceStateUpdateData
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-voice-state}
 */
export interface GatewayVoiceStateUpdateData {
  /**
   * ID of the guild
   */
  guild_id: Snowflake
  /**
   * ID of the voice channel client wants to join (`null` if disconnecting)
   */
  channel_id: Snowflake | null
  /**
   * Is the client muted
   */
  self_mute: boolean
  /**
   * Is the client deafened
   */
  self_deaf: boolean
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-presence}
 */
export interface GatewayUpdatePresence {
  op: GatewayOpcodes.PresenceUpdate
  d: GatewayPresenceUpdateData
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-presence-gateway-presence-update-structure}
 */
export interface GatewayPresenceUpdateData {
  /**
   * Unix time (in milliseconds) of when the client went idle, or `null` if the client is not idle
   */
  since: number | null
  /**
   * The user's activities
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object}
   */
  activities: Array<GatewayActivityUpdateData>
  /**
   * The user's new status
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-presence-status-types}
   */
  status: PresenceUpdateStatus
  /**
   * Whether or not the client is afk
   */
  afk: boolean
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-structure}
 */
export type GatewayActivityUpdateData = Pick<
  GatewayActivity,
  "name" | "state" | "type" | "url"
>

// #endregion Sendable Payloads

// #region Shared
export interface _BasePayload {
  /**
   * Opcode for the payload
   */
  op: GatewayOpcodes
  /**
   * Event data
   */
  d?: unknown
  /**
   * Sequence number, used for resuming sessions and heartbeats
   */
  s: number
  /**
   * The event name for this payload
   */
  t?: string
}

export type _NonDispatchPayload = Omit<_BasePayload, "s" | "t"> & {
  t: null
  s: null
}

export interface _DataPayload<
  Event extends GatewayDispatchEvents,
  D = unknown,
> extends _BasePayload {
  op: GatewayOpcodes.Dispatch
  t: Event
  d: D
}

export type GatewayMessageReactionData<
  E extends GatewayDispatchEvents,
  O extends string = never,
> = _DataPayload<
  E,
  Omit<
    {
      /**
       * The id of the user
       */
      user_id: Snowflake
      /**
       * The id of the channel
       */
      channel_id: Snowflake
      /**
       * The id of the message
       */
      message_id: Snowflake
      /**
       * The id of the guild
       */
      guild_id?: Snowflake
      /**
       * The member who reacted if this happened in a guild
       *
       * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
       */
      member?: APIGuildMember
      /**
       * The emoji used to react
       *
       * @see {@link https://discord.com/developers/docs/resources/emoji#emoji-object}
       */
      emoji: APIEmoji
      /**
       * The id of the user that posted the message that was reacted to
       */
      message_author_id?: Snowflake
      /**
       * True if this is a super-reaction
       */
      burst: boolean
      /**
       * Colors used for super-reaction animation in "#rrggbb" format
       */
      burst_colors: Array<string>
      /**
       * The type of reaction
       */
      type: ReactionType
    },
    O
  >
>

export interface GatewayMessageReactionRemoveData {
  /**
   * The id of the channel
   */
  channel_id: Snowflake
  /**
   * The id of the message
   */
  message_id: Snowflake
  /**
   * The id of the guild
   */
  guild_id?: Snowflake
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway#get-gateway}
 */
export interface APIGatewayInfo {
  /**
   * The WSS URL that can be used for connecting to the gateway
   */
  url: string
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway#get-gateway-bot}
 */
export interface APIGatewayBotInfo extends APIGatewayInfo {
  /**
   * The recommended number of shards to use when connecting
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway#sharding}
   */
  shards: number
  /**
   * Information on the current session start limit
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway#session-start-limit-object}
   */
  session_start_limit: APIGatewaySessionStartLimit
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway#session-start-limit-object}
 */
export interface APIGatewaySessionStartLimit {
  /**
   * The total number of session starts the current user is allowed
   */
  total: number
  /**
   * The remaining number of session starts the current user is allowed
   */
  remaining: number
  /**
   * The number of milliseconds after which the limit resets
   */
  reset_after: number
  /**
   * The number of identify requests allowed per 5 seconds
   */
  max_concurrency: number
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#presence-update-presence-update-event-fields}
 */
export interface GatewayPresenceUpdate {
  /**
   * The user presence is being updated for
   *
   * **The user object within this event can be partial, the only field which must be sent is the `id` field,
   * everything else is optional.**
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  user: Partial<APIUser> & Pick<APIUser, "id">
  /**
   * ID of the guild
   */
  guild_id: Snowflake
  /**
   * Either "idle", "dnd", "online", or "offline"
   */
  status?: PresenceUpdateReceiveStatus
  /**
   * User's current activities
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object}
   */
  activities?: Array<GatewayActivity>
  /**
   * User's platform-dependent status
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#client-status-object}
   */
  client_status?: GatewayPresenceClientStatus
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-presence-status-types}
 */
export enum PresenceUpdateStatus {
  Online = "online",
  DoNotDisturb = "dnd",
  Idle = "idle",
  /**
   * Invisible and shown as offline
   */
  Invisible = "invisible",
  Offline = "offline",
}

export type PresenceUpdateReceiveStatus = Exclude<
  PresenceUpdateStatus,
  PresenceUpdateStatus.Invisible
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#client-status-object}
 */
export interface GatewayPresenceClientStatus {
  /**
   * The user's status set for an active desktop (Windows, Linux, Mac) application session
   */
  desktop?: PresenceUpdateReceiveStatus
  /**
   * The user's status set for an active mobile (iOS, Android) application session
   */
  mobile?: PresenceUpdateReceiveStatus
  /**
   * The user's status set for an active web (browser, bot account) application session
   */
  web?: PresenceUpdateReceiveStatus
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-structure}
 */
export interface GatewayActivity {
  /**
   * The activity's id
   *
   * @unstable
   */
  id: string
  /**
   * The activity's name
   */
  name: string
  /**
   * Activity type
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-types}
   */
  type: ActivityType
  /**
   * Stream url, is validated when type is `1`
   */
  url?: string | null
  /**
   * Unix timestamp of when the activity was added to the user's session
   */
  created_at: number
  /**
   * Unix timestamps for start and/or end of the game
   */
  timestamps?: GatewayActivityTimestamps
  /**
   * The Spotify song id
   *
   * @unstable
   */
  sync_id?: string
  /**
   * The platform this activity is being done on
   *
   * @unstable You can use {@link ActivityPlatform} as a stepping stone, but this might be inaccurate
   */
  platform?: string
  /**
   * Application id for the game
   */
  application_id?: Snowflake
  /**
   * What the player is currently doing
   */
  details?: string | null
  /**
   * The user's current party status, or the text used for a custom status
   */
  state?: string | null
  /**
   * The emoji used for a custom status
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-emoji}
   */
  emoji?: GatewayActivityEmoji
  /**
   * @unstable
   */
  session_id?: string
  /**
   * Information for the current party of the player
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-party}
   */
  party?: GatewayActivityParty
  /**
   * Images for the presence and their hover texts
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-assets}
   */
  assets?: GatewayActivityAssets
  /**
   * Secrets for Rich Presence joining and spectating
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-secrets}
   */
  secrets?: GatewayActivitySecrets
  /**
   * Whether or not the activity is an instanced game session
   */
  instance?: boolean
  /**
   * Activity flags `OR`d together, describes what the payload includes
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-flags}
   * @see {@link https://en.wikipedia.org/wiki/Bit_field}
   */
  flags?: ActivityFlags
  /**
   * The custom buttons shown in the Rich Presence (max 2)
   */
  buttons?: Array<GatewayActivityButton> | Array<string>
}

/**
 * @unstable This enum is currently not documented by Discord but has known values which we will try to keep up to date.
 * Values might be added or removed without a major version bump.
 */
export enum ActivityPlatform {
  Desktop = "desktop",
  Xbox = "xbox",
  Samsung = "samsung",
  IOS = "ios",
  Android = "android",
  Embedded = "embedded",
  PS4 = "ps4",
  PS5 = "ps5",
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-types}
 */
export enum ActivityType {
  /**
   * Playing \{game\}
   */
  Playing,
  /**
   * Streaming \{details\}
   */
  Streaming,
  /**
   * Listening to \{name\}
   */
  Listening,
  /**
   * Watching \{details\}
   */
  Watching,
  /**
   * \{emoji\} \{state\}
   */
  Custom,
  /**
   * Competing in \{name\}
   */
  Competing,
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-timestamps}
 */
export interface GatewayActivityTimestamps {
  /**
   * Unix time (in milliseconds) of when the activity started
   */
  start?: number
  /**
   * Unix time (in milliseconds) of when the activity ends
   */
  end?: number
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-emoji}
 */
export type GatewayActivityEmoji = Partial<Pick<APIEmoji, "animated" | "id">> &
  Pick<APIEmoji, "name">

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-party}
 */
export interface GatewayActivityParty {
  /**
   * The id of the party
   */
  id?: string
  /**
   * Used to show the party's current and maximum size
   */
  size?: [current_size: number, max_size: number]
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-assets}
 */
export type GatewayActivityAssets = Partial<
  Record<"large_image" | "large_text" | "small_image" | "small_text", string>
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-secrets}
 */
export type GatewayActivitySecrets = Partial<
  Record<"join" | "match" | "spectate", string>
>

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-flags}
 */
export enum ActivityFlags {
  Instance = 1 << 0,
  Join = 1 << 1,
  Spectate = 1 << 2,
  JoinRequest = 1 << 3,
  Sync = 1 << 4,
  Play = 1 << 5,
  PartyPrivacyFriends = 1 << 6,
  PartyPrivacyVoiceChannel = 1 << 7,
  Embedded = 1 << 8,
}

export interface GatewayActivityButton {
  /**
   * The text shown on the button (1-32 characters)
   */
  label: string
  /**
   * The url opened when clicking the button (1-512 characters)
   */
  url: string
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-list-sync-thread-list-sync-event-fields}
 */
export interface GatewayThreadListSync {
  /**
   * ID of the guild
   */
  guild_id: Snowflake
  /**
   * The ids of all the parent channels whose threads are being synced, otherwise the entire guild
   */
  channel_ids?: Array<Snowflake>
  /**
   * Array of the synced threads
   */
  threads: Array<APIThreadChannel>
  /**
   * The member objects for the client user in each joined thread that was synced
   */
  members: Array<APIThreadMember>
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-members-update-thread-members-update-event-fields}
 */
export interface GatewayThreadMembersUpdate {
  /**
   * The id of the thread for which members are being synced
   */
  id: Snowflake
  /**
   * The id of the guild that the thread is in
   */
  guild_id: Snowflake
  /**
   * The approximate member count of the thread, does not count above 50 even if there are more members
   */
  member_count: number
  /**
   * The members that were added to the thread
   */
  added_members?: Array<APIThreadMember>
  /**
   * The ids of the members that were removed from the thread
   */
  removed_member_ids?: Array<Snowflake>
}
