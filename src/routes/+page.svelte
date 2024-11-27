<script lang="ts">
	import Cell from '../Cell.svelte';

	let game_state = $state(Array.from({ length: 64 }, () => false));

	let rows = $derived(
		Array.from({ length: 8 }, (_, i) => game_state.slice(i * 8, i * 8 + 8).every(Boolean))
	);
	let cols = $derived(
		Array.from({ length: 8 }, (_, i) =>
			game_state
				.slice(i, i + 64)
				.filter((_, i) => i % 8 == 0)
				.every(Boolean)
		)
	);

	let undo_stack: boolean[][] = $state([]);
</script>

<svelte:head>
	<title>Block Blast Playground</title>
</svelte:head>

<button
	class="m-auto block"
	onclick={() => {
		let undo = undo_stack.pop();
		if (undo) {
			game_state = game_state.map((cell, i) => undo[i] !== cell);
		} else {
			console.log('Nothing to undo!');
		}
	}}>Undo</button
>
<button
	class="m-auto block"
	onclick={() => {
		let undo = game_state.map((_, i) => rows[Math.floor(i / 8)] || cols[i % 8]);
		undo_stack.push(undo);
		game_state = game_state.map((cell, i) => undo[i] !== cell);
	}}>Blast</button
>
<div class="m-auto grid aspect-square max-h-screen grid-cols-8 grid-rows-8 gap-1 bg-slate-900 p-1">
	{#each game_state as _, i}
		<Cell
			is_bright={rows[Math.floor(i / 8)] || cols[i % 8]}
			bind:checked={game_state[i]}
			onchange={() => {
				undo_stack.push(game_state.map((_, j) => i === j));
			}}
		/>
	{/each}
</div>
