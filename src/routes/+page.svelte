<script lang="ts">
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

<div class="flex flex-col items-center">
	<button
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
		onclick={() => {
			let undo = game_state.map((_, i) => rows[Math.floor(i / 8)] || cols[i % 8]);
			undo_stack.push(undo);
			game_state = game_state.map((cell, i) => undo[i] !== cell);
		}}>Blast</button
	>
	<div class="grid aspect-square grid-cols-8 grid-rows-8 gap-2 bg-slate-900 p-2">
		{#each game_state as _, i}
			<div class="rounded-md bg-slate-800 min-w-10">
				<label
					class="block h-full w-full cursor-pointer rounded-md has-[:checked]:bg-rose-500"
					class:brightness-200={rows[Math.floor(i / 8)] || cols[i % 8]}
				>
					<input
						type="checkbox"
						class="hidden"
						bind:checked={game_state[i]}
						onchange={() => undo_stack.push(game_state.map((_, j) => i == j))}
					/>
				</label>
			</div>
		{/each}
	</div>
</div>
