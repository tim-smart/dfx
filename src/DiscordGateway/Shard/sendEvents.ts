import * as Discord from "dfx/types"

export const heartbeat = (
  d: Discord.GatewayHeartbeatData,
): Discord.GatewayHeartbeat => ({
  op: Discord.GatewayOpcodes.Heartbeat,
  d,
})

export const identify = (
  d: Discord.GatewayIdentifyData,
): Discord.GatewayIdentify => ({
  op: Discord.GatewayOpcodes.Identify,
  d,
})

export const resume = (
  d: Discord.GatewayResumeData,
): Discord.GatewayResume => ({
  op: Discord.GatewayOpcodes.Resume,
  d,
})

export const requestGuildMembers = (
  d: Discord.GatewayRequestGuildMembersData,
): Discord.GatewayRequestGuildMembers => ({
  op: Discord.GatewayOpcodes.RequestGuildMembers,
  d,
})

export const voiceStateUpdate = (
  d: Discord.GatewayVoiceStateUpdateData,
): Discord.GatewayVoiceStateUpdate => ({
  op: Discord.GatewayOpcodes.VoiceStateUpdate,
  d,
})

export const presenceUpdate = (
  d: Discord.GatewayPresenceUpdateData,
): Discord.GatewayUpdatePresence => ({
  op: Discord.GatewayOpcodes.PresenceUpdate,
  d,
})
