import TactileStimulusController from "../modules/TactileStimulusController"

async function main() {
    const instance = await TactileStimulusController.Create()

    await instance.stimulateForearm('left')
    await instance.stimulateForearm('right')
}

main().catch((error) => {
    console.error('Error in main:', error)
    process.exit(1)
})
