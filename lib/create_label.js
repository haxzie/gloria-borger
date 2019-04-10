// Add submission label to the Pull request
module.exports = async function (context, number, name) {
    await context.github.issues.addLabels(context.issue({
        labels: [name],
        number: number
    }));
}