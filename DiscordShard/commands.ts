import {
  GatewayOpcode,
  GatewayPayload,
  Heartbeat,
  Identify,
  RequestGuildMember,
  Resume,
  UpdatePresence,
  UpdateVoiceState,
} from "../types"

export const heartbeat = (d: Heartbeat): GatewayPayload => ({
  op: GatewayOpcode.HEARTBEAT,
  d,
})

export const identify = (d: Identify): GatewayPayload => ({
  op: GatewayOpcode.IDENTIFY,
  d,
})

export const resume = (d: Resume): GatewayPayload => ({
  op: GatewayOpcode.RESUME,
  d,
})

export const requestGuildMembers = (d: RequestGuildMember): GatewayPayload => ({
  op: GatewayOpcode.REQUEST_GUILD_MEMBERS,
  d,
})

export const voiceStateUpdate = (d: UpdateVoiceState): GatewayPayload => ({
  op: GatewayOpcode.VOICE_STATE_UPDATE,
  d,
})

export const presenceUpdate = (d: UpdatePresence): GatewayPayload => ({
  op: GatewayOpcode.PRESENCE_UPDATE,
  d,
})
