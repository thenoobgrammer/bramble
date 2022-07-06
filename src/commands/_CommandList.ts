import { CommandInt } from "../interface/commandInt"

import { addToQueue } from "./addToQueue"
import { clear } from './clear'
import { next } from './next'
import { play } from './play'
import { previous } from './previous'
import { remove } from './remove'
import { resume } from './resume'
import { showQueue } from './showQueue'
import { stop } from './stop'

export const CommandList: CommandInt [] = [addToQueue, clear, next, play, previous, remove, resume, showQueue, stop]