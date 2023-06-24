const { test, expect } = require('@playwright/test')
let lists = []
let toBeDeactivated = []
let addedItems = []
function getRandomValue(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}
let subtract = 0

let randomLink = ''
let removed_items = []

// You can change the value of elements to be added by changing the number of params below.
// Please note that if the number of items to add is less than or equal to the number of items to deactivate, the test will break.
const listAmountToAdd = 50
const itemAmountToAdd = 10
let upperBorder = listAmountToAdd
const listAmountToDeactivate = 15
const itemAmountToDeactivate = 4

test('Main page has expected title and headings.', async ({ page }) => {
	await page.goto('/delete')
	await page.goto('/')
	await expect(await page).toHaveTitle('Shared shopping lists')
})

test('There should be No shopping list title on the main page when web site is open for the first time', async ({
	page,
}) => {
	await page.goto('/')
	await expect(await page.locator('h2')).toHaveText('No shopping lists yet')
})

test('There are no attributes in the unordered list first time the main page is opened', async ({
	page,
}) => {
	await page.goto('/lists')
	await expect(await page.getByTestId('list').locator('li')).toHaveCount(0)
})

test('All added lists are inside of the unordered list', async ({ page }) => {
	await page.goto('/lists')
	for (let i = 0; i < listAmountToAdd; i++) {
		await page.goto('/lists')
		lists.push(i.toString())
		await page.locator('form input[type=text]').type(i.toString())
		await page.getByRole('button', { name: 'Add' }).click()
	}
	//console.log(page.getByTestId('list').locator('a').all())
	//console.log(lists)
	await expect(page.getByTestId('list').locator('a')).toHaveText(lists)
})

test('A few random list is deactivated successfully', async ({ page }) => {
	await page.goto('/lists')
	upperBorder = listAmountToAdd - 1
	for (let i = 0; i < listAmountToDeactivate; i++) {
		const deactivatedIndex = getRandomValue(1, upperBorder)
		const deactivatedName = deactivatedIndex.toString()
		toBeDeactivated.push(deactivatedName)

		await page
			.getByTestId('list')
			.locator(
				`li:nth-child(${deactivatedIndex}) form input[type="submit"]`
			)
			.click()

		upperBorder = upperBorder - 1
	}
	await expect(
		await page
			.getByTestId('list')
			.locator('li a')
			.filter({ hasNotText: toBeDeactivated })
	).toHaveCount(listAmountToAdd - listAmountToDeactivate)
})

test('There is an unordered list with the right number of shopping lists and items in them (listAmountToAdd,0)', async ({
	page,
}) => {
	await page.goto('/')
	await expect(page.getByTestId('statistic').locator('li')).toHaveText([
		`Shopping lists: ${listAmountToAdd}`,
		'Shopping list items: 0',
	])
})

test('Items are added to some random list successfully', async ({ page }) => {
	let randomNumber = getRandomValue(
		1,
		listAmountToAdd - listAmountToDeactivate
	)
	while (toBeDeactivated.includes(randomNumber)) {
		randomNumber = getRandomValue(
			1,
			listAmountToAdd - listAmountToDeactivate
		)
	}
	await page.goto('/lists')
	const allLinks = await page.$$('ul[data-testid="list"] li a')
	randomLink = await allLinks[randomNumber].getAttribute('href')
	await page.goto(randomLink)
	for (let i = 0; i < itemAmountToAdd; i++) {
		addedItems.push(i.toString() + ' big cucumbers')
		await page
			.locator('input[type="text"]')
			.type(i.toString() + ' big cucumbers')
		await page.getByRole('button', { name: 'Add' }).click()
	}
	await expect(page.locator('li p')).toHaveText(addedItems)
})

test('Some elements are marked as collected successfully', async ({ page }) => {
	await page.goto(randomLink)
	upperBorder = itemAmountToAdd
	let randomNumber_2 = getRandomValue(1, upperBorder)
	for (let i = 0; i < itemAmountToDeactivate; i++) {
		removed_items.push(
			await page
				.getByTestId('items')
				.locator(`li:nth-child(${randomNumber_2}) p`)
				.textContent()
		)
		await page
			.getByTestId('items')
			.locator(
				`li:nth-child(${randomNumber_2}) form input[type="submit"]`
			)
			.click()
		upperBorder = upperBorder - 1
		randomNumber_2 = getRandomValue(1, upperBorder)
	}
	await expect(page.getByTestId('items').locator('li del')).toHaveCount(4)
})

test('Deleted elements contain the right value', async ({ page }) => {
	await page.goto(randomLink)
	removed_items = removed_items.sort((a, b) => {
		const aValue = a.trim()
		const bValue = b.trim()
		return aValue.localeCompare(bValue)
	})
	await expect(page.getByTestId('items').locator('li del')).toContainText(
		removed_items
	)
})

test('There are no side effects from marking items as collected or deactivating some shopping lists. Instead, the numbers of shopping lists and items should remain the same', async ({
	page,
}) => {
	await page.goto('/')
	await expect(page.getByTestId('statistic').locator('li')).toHaveText([
		`Shopping lists: ${listAmountToAdd}`,
		`Shopping list items: ${itemAmountToAdd}`,
	])
	await expect(await page).toHaveTitle('Shared shopping lists')
})

//redirect tests

test('deletes', async ({ page }) => {
	await page.goto('/delete')
	await page.goto('/lists')
	await expect(page.getByTestId('list').locator('li')).toHaveCount(0)
})
