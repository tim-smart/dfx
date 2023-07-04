import { Discord } from "dfx/_common"

export const heartbeat = (
  d: Discord.Heartbeat,
): Discord.GatewayPayload<Discord.Heartbeat> => ({
  op: Discord.GatewayOpcode.HEARTBEAT,
  d,
})

export const identify = (
  d: Discord.Identify,
): Discord.GatewayPayload<Discord.Identify> => ({
  op: Discord.GatewayOpcode.IDENTIFY,
  d,
})

export const resume = (
  d: Discord.Resume,
): Discord.GatewayPayload<Discord.Resume> => ({
  op: Discord.GatewayOpcode.RESUME,
  d,
})

export const requestGuildMembers = (
  d: Discord.RequestGuildMember,
): Discord.GatewayPayload<Discord.RequestGuildMember> => ({
  op: Discord.GatewayOpcode.REQUEST_GUILD_MEMBERS,
  d,
})

export const voiceStateUpdate = (
  d: Discord.UpdateVoiceState,
): Discord.GatewayPayload<Discord.UpdateVoiceState> => ({
  op: Discord.GatewayOpcode.VOICE_STATE_UPDATE,
  d,
})

export const presenceUpdate = (
  d: Discord.UpdatePresence,
): Discord.GatewayPayload<Discord.UpdatePresence> => ({
  op: Discord.GatewayOpcode.PRESENCE_UPDATE,
  d,
})
