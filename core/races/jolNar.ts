import { ParticipantInstance, BattleInstance } from '../battle-types'
import { BattleEffect, registerUse } from '../battleeffect/battleEffects'
import { HitInfo } from '../roll'
import { defaultRoll, getUnitWithImproved, UnitInstance, UnitType } from '../unit'

export const jolNar: BattleEffect[] = [
  {
    type: 'race',
    name: 'Jol-Nar flagship',
    transformUnit: (unit: UnitInstance) => {
      if (unit.type === UnitType.flagship) {
        return {
          ...unit,
          combat: {
            ...defaultRoll,
            hit: 6,
            count: 2,
          },
          onHit: (
            _participant: ParticipantInstance,
            _battle: BattleInstance,
            _otherParticipant: ParticipantInstance,
            hitInfo: HitInfo,
          ) => {
            hitInfo.rollInfo.forEach((roll) => {
              if (roll > 9) {
                console.log('omg jol-nar!!')
                hitInfo.hits += 2
              }
            })
          },
        }
      } else {
        return unit
      }
    },
  },
  {
    name: 'Jol-Nar Fragile ability',
    type: 'race',
    transformUnit: (u: UnitInstance) => {
      return getUnitWithImproved(u, 'combat', 'hit', 'permanent', -1)
    },
  },
  {
    type: 'race',
    name: 'Jol-Nar mech',
    transformUnit: (unit: UnitInstance) => {
      if (unit.type === UnitType.mech) {
        return {
          ...unit,
          aura: [
            {
              name: 'Jol-Nar mech aura',
              onCombatRoundStart: (
                auraUnits: UnitInstance[],
                p: ParticipantInstance,
                _battle: BattleInstance,
                effectName: string,
              ) => {
                for (const unit of auraUnits) {
                  if (unit.type === UnitType.infantry) {
                    unit.combat!.hitBonusTmp += 1
                  }
                }
                registerUse(effectName, p)
              },
              timesPerRound: 1,
            },
          ],
        }
      } else {
        return unit
      }
    },
  },
  // TODO add commander
]
