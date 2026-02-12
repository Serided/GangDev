<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

candor_require_verified();

$userId = candor_current_user_id();
$user = $userId ? candor_user_row($userId) : null;
$profile = $userId ? candor_profile_row($userId) : null;
$name = $user['display_name'] ?? ($user['username'] ?? '');
$email = $user['email'] ?? '';
$birthdate = $profile['birthdate'] ?? '';
$cookieKey = 'candor_time_format_' . $userId;
$candorMeta = 'create';
$candorLead = '';
$candorAuthed = true;
$candorName = $name !== '' ? $name : $email;
$candorShowMyOs = true;
$candorVersion = 'v0.2';
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Candor - Create</title>
	<?php require '/var/www/gangdev/candor/files/php/repetitive.php'; ?>
	<link rel="stylesheet" href="style.css?v=39">
	<script src="script.js?v=37" defer></script>
</head>
<body class="is-create" data-user-key="<?= htmlspecialchars((string)$userId) ?>" data-clock-cookie="<?= htmlspecialchars($cookieKey) ?>" data-birthdate="<?= htmlspecialchars((string)$birthdate) ?>">

<div class="page">
	<?php require '/var/www/gangdev/candor/files/php/nav.php'; ?>

	<section class="hero">
		<div class="heroCopy">
			<h1>Build your cadence.</h1>
			<p>Design the repeating structure behind your perfect days. Map sleep, focus, and life into a weekly template so My OS can adapt the execution.</p>
		</div>
	</section>

	<section class="builder">
		<div class="builderRow is-top">
			<div class="card scheduleCard">
				<div class="cardHead is-stack">
					<h2>Sleep schedule</h2>
					<span class="cardHint">Weekdays, weekends, daily, or a specific day.</span>
				</div>
				<form class="formGrid" data-sleep-form>
					<div class="field field-time">
						<label class="label" for="sleep-start-hour">Start</label>
						<div class="timeField" data-time-field data-time-label="Sleep start" data-time-empty="--:--">
							<input type="hidden" id="sleep-start" name="start" data-time-output>
							<button class="timeButton" type="button" data-time-display>--:--</button>
						</div>
					</div>
					<div class="field field-time">
						<label class="label" for="sleep-end-hour">End</label>
						<div class="timeField" data-time-field data-time-label="Sleep end" data-time-empty="--:--">
							<input type="hidden" id="sleep-end" name="end" data-time-output>
							<button class="timeButton" type="button" data-time-display>--:--</button>
						</div>
					</div>
					<div class="field field-repeat">
						<label class="label" for="sleep-repeat">Repeat</label>
						<select class="input compact select" id="sleep-repeat" name="repeat" data-repeat-select>
							<option value="weekdays">Weekdays</option>
							<option value="weekends">Weekends</option>
							<option value="daily">Daily</option>
							<option value="day">Specific day</option>
						</select>
					</div>
					<div class="field field-color">
						<label class="label" for="sleep-color">Color</label>
						<input class="input compact color colorSwatch" id="sleep-color" name="color" type="color" value="#b9dbf2" data-default="#b9dbf2">
					</div>
					<div class="field field-day" data-day-field>
						<label class="label" for="sleep-day">Day</label>
						<select class="input compact select" id="sleep-day" name="day">
							<option value="0">Sunday</option>
							<option value="1">Monday</option>
							<option value="2">Tuesday</option>
							<option value="3">Wednesday</option>
							<option value="4">Thursday</option>
							<option value="5">Friday</option>
							<option value="6">Saturday</option>
						</select>
					</div>
					<div class="formActions">
						<button class="btn primary" type="submit">Save</button>
						<button class="btn ghost" type="button" data-sleep-clear>Clear</button>
					</div>
				</form>
				<div class="sleepSummary">
					<div class="listHeader">Active schedules</div>
					<div class="listEmpty" data-sleep-empty>No sleep schedule yet.</div>
					<div class="itemList savedScroll" data-sleep-list></div>
				</div>
			</div>

				<div class="card routineCard">
					<div class="cardHead">
						<h2>Windows</h2>
						<span class="cardHint">Build repeatable windows for routines, work, and focus.</span>
					</div>
				<div class="routineLayout">
					<div class="routineBuild">
						<form class="routineForm" data-routine-form>
							<div class="routineGrid">
								<div class="routineMeta">
								<div class="fieldRow typeRow" data-type-row>
								<div class="field field-type">
									<label class="label" for="block-type">Type</label>
									<select class="input compact select" id="block-type" name="block_type" data-block-type>
										<option value="routine">Routine</option>
										<option value="work">Work</option>
										<option value="focus">Focus</option>
										<option value="custom">Custom</option>
									</select>
								</div>
								<div class="field" data-anchor-field>
									<label class="label" for="routine-anchor">Routine timing</label>
									<select class="input compact select" id="routine-anchor" name="anchor" data-anchor-select>
										<option value="morning">Morning</option>
										<option value="evening">Evening</option>
										<option value="custom">Custom</option>
									</select>
								</div>
								<div class="field field-color" data-routine-color-field>
									<label class="label" for="routine-color">Color</label>
									<input class="input compact color colorSwatch" id="routine-color" type="color" name="color" value="#f3c873" data-default="#f3c873">
								</div>
							</div>
									<div class="field" data-routine-use-select>
										<label class="label" for="routine-use-select">Use routine</label>
										<div class="shiftRow">
											<select class="input compact select" id="routine-use-select" data-routine-select>
												<option value="">Select a routine</option>
											</select>
											<button class="btn shiftUseBtn" type="button" data-routine-use>Use</button>
										</div>
									</div>
									<div class="field" data-title-field>
										<label class="label" for="routine-title" data-title-label>Name</label>
										<input class="input compact" id="routine-title" type="text" name="title" placeholder="e.g. Deep work sprint">
									</div>
									<div class="field" data-work-shift-select>
										<label class="label" for="work-shift-select">Use shift</label>
										<div class="shiftRow">
											<select class="input compact select" id="work-shift-select" data-shift-select>
												<option value="">Select a shift</option>
											</select>
											<button class="btn shiftUseBtn" type="button" data-shift-use>Use</button>
										</div>
										<input type="hidden" name="shift_id" data-shift-id>
									</div>
									<div class="shiftTimingRow" data-shift-timing-row>
										<div class="fieldRow shiftRowLine" data-shift-line>
											<div class="field">
												<label class="label" for="shift-commute-before">In</label>
												<input class="input compact" id="shift-commute-before" type="number" min="0" max="999" step="5" inputmode="numeric" placeholder="15">
											</div>
											<div class="field">
												<label class="label" for="shift-start-hour">Start</label>
												<div class="timeField" data-time-field data-time-label="Shift start" data-time-empty="--:--">
													<input type="hidden" id="shift-start" data-time-output>
													<button class="timeButton" type="button" data-time-display>--:--</button>
												</div>
											</div>
											<div class="field">
												<label class="label" for="shift-end-hour">End</label>
												<div class="timeField" data-time-field data-time-label="Shift end" data-time-empty="--:--">
													<input type="hidden" id="shift-end" data-time-output>
													<button class="timeButton" type="button" data-time-display>--:--</button>
												</div>
											</div>
											<div class="field">
												<label class="label" for="shift-commute-after">Out</label>
												<input class="input compact" id="shift-commute-after" type="number" min="0" max="999" step="5" inputmode="numeric" placeholder="15">
											</div>
										</div>
										<div class="fieldRow timeRow" data-time-row>
										<div class="field" data-time-field-wrap>
											<label class="label" for="routine-time-hour">Start</label>
											<div class="timeField" data-time-field data-time-label="Block start" data-time-empty="--:--">
												<input type="hidden" id="routine-time" name="time" data-time-output>
												<button class="timeButton" type="button" data-time-display>--:--</button>
											</div>
										</div>
										<div class="field" data-work-end-field>
											<label class="label" for="routine-end-hour">End</label>
											<div class="timeField" data-time-field data-time-label="Block end" data-time-empty="--:--">
												<input type="hidden" id="routine-end" name="end" data-time-output>
												<button class="timeButton" type="button" data-time-display>--:--</button>
											</div>
										</div>
										<div class="field field-repeat" data-repeat-field>
											<label class="label" for="routine-repeat">Repeat</label>
											<select class="input compact select" id="routine-repeat" name="repeat" data-routine-repeat>
												<option value="daily">Daily</option>
												<option value="weekdays">Weekdays</option>
												<option value="weekends">Weekends</option>
												<option value="day">Specific day</option>
											</select>
										</div>
										<label class="toggleLine shiftDefault" data-shift-default>
											<input type="checkbox" id="shift-default">
											<span>Default shift</span>
										</label>
										</div>
									</div>
									<div class="fieldHint" data-anchor-note></div>
									<div class="field" data-routine-day-field>
										<label class="label">Days</label>
										<div class="dayMulti">
											<label class="dayOption">
												<input type="checkbox" value="0" data-routine-day>
												<span>Sun</span>
											</label>
											<label class="dayOption">
												<input type="checkbox" value="1" data-routine-day>
												<span>Mon</span>
											</label>
											<label class="dayOption">
												<input type="checkbox" value="2" data-routine-day>
												<span>Tue</span>
											</label>
											<label class="dayOption">
												<input type="checkbox" value="3" data-routine-day>
												<span>Wed</span>
											</label>
											<label class="dayOption">
												<input type="checkbox" value="4" data-routine-day>
												<span>Thu</span>
											</label>
											<label class="dayOption">
												<input type="checkbox" value="5" data-routine-day>
												<span>Fri</span>
											</label>
											<label class="dayOption">
												<input type="checkbox" value="6" data-routine-day>
												<span>Sat</span>
											</label>
										</div>
									</div>
								</div>
								<div class="routineTasks">
									<div class="label routineTasksLabel">Tasks</div>
									<div class="taskStack" data-routine-tasks></div>
									<button class="taskAdd" type="button" data-routine-add-task aria-label="Add task">+</button>
									<div class="routineTotal" data-routine-total>Estimated: 0 min</div>
								</div>
							</div>
							<div class="formActions">
								<button class="btn primary" type="submit" data-routine-submit>Save</button>
								<button class="btn ghost" type="button" data-routine-cancel style="display: none;">Cancel edit</button>
							</div>
						</form>
					</div>
					<div class="savedSection">
						<div class="listHeader">Saved windows</div>
						<div class="listEmpty" data-routine-empty>No windows yet.</div>
						<div class="itemList savedScroll" data-routine-list></div>
					</div>
				</div>
			</div>
		</div>

		<div class="builderRow is-full">
			<div class="card weekCard">
				<div class="cardHead">
					<h2>Week template</h2>
					<span class="cardHint">Draft the full week so routines land under each day.</span>
				</div>
				<div class="weekGrid" data-week-grid>
					<div class="weekColumn" data-week-day="0">
						<div class="weekDay">Sun</div>
						<div class="weekStack">
							<div class="weekBlock is-sleep">Sleep</div>
							<div class="weekBlock is-morning">Morning routine</div>
                            <div class="weekBlock is-focus">Focus/Work</div>
							<div class="weekBlock is-evening">Evening routine</div>
							<div class="weekBlock is-sleep">Sleep</div>
						</div>
						<div class="weekRoutines" data-week-list></div>
					</div>
					<div class="weekColumn" data-week-day="1">
						<div class="weekDay">Mon</div>
						<div class="weekStack">
							<div class="weekBlock is-sleep">Sleep</div>
							<div class="weekBlock is-morning">Morning routine</div>
                            <div class="weekBlock is-focus">Focus/Work</div>
							<div class="weekBlock is-evening">Evening routine</div>
							<div class="weekBlock is-sleep">Sleep</div>
						</div>
						<div class="weekRoutines" data-week-list></div>
					</div>
					<div class="weekColumn" data-week-day="2">
						<div class="weekDay">Tue</div>
						<div class="weekStack">
							<div class="weekBlock is-sleep">Sleep</div>
							<div class="weekBlock is-morning">Morning routine</div>
                            <div class="weekBlock is-focus">Focus/Work</div>
							<div class="weekBlock is-evening">Evening routine</div>
							<div class="weekBlock is-sleep">Sleep</div>
						</div>
						<div class="weekRoutines" data-week-list></div>
					</div>
					<div class="weekColumn" data-week-day="3">
						<div class="weekDay">Wed</div>
						<div class="weekStack">
							<div class="weekBlock is-sleep">Sleep</div>
							<div class="weekBlock is-morning">Morning routine</div>
                            <div class="weekBlock is-focus">Focus/Work</div>
							<div class="weekBlock is-evening">Evening routine</div>
							<div class="weekBlock is-sleep">Sleep</div>
						</div>
						<div class="weekRoutines" data-week-list></div>
					</div>
					<div class="weekColumn" data-week-day="4">
						<div class="weekDay">Thu</div>
						<div class="weekStack">
							<div class="weekBlock is-sleep">Sleep</div>
							<div class="weekBlock is-morning">Morning routine</div>
                            <div class="weekBlock is-focus">Focus/Work</div>
							<div class="weekBlock is-evening">Evening routine</div>
							<div class="weekBlock is-sleep">Sleep</div>
						</div>
						<div class="weekRoutines" data-week-list></div>
					</div>
					<div class="weekColumn" data-week-day="5">
						<div class="weekDay">Fri</div>
						<div class="weekStack">
							<div class="weekBlock is-sleep">Sleep</div>
							<div class="weekBlock is-morning">Morning routine</div>
                            <div class="weekBlock is-focus">Focus/Work</div>
							<div class="weekBlock is-evening">Evening routine</div>
							<div class="weekBlock is-sleep">Sleep</div>
						</div>
						<div class="weekRoutines" data-week-list></div>
					</div>
					<div class="weekColumn" data-week-day="6">
						<div class="weekDay">Sat</div>
						<div class="weekStack">
							<div class="weekBlock is-sleep">Sleep</div>
							<div class="weekBlock is-morning">Morning routine</div>
                            <div class="weekBlock is-focus">Focus/Work</div>
							<div class="weekBlock is-evening">Evening routine</div>
							<div class="weekBlock is-sleep">Sleep</div>
						</div>
						<div class="weekRoutines" data-week-list></div>
					</div>
				</div>
				<button class="weekAdd" type="button" data-repeat-open aria-label="Add repeat task">+</button>
			</div>
		</div>
	</section>

	<div class="repeatOverlay" data-repeat-overlay>
		<div class="repeatCard">
			<div class="repeatHeader">
				<div class="repeatTitle">Repeat task</div>
				<button class="iconBtn" type="button" data-repeat-close aria-label="Close">&times;</button>
			</div>
			<form class="repeatForm" data-repeat-form>
				<div class="field">
					<label class="label" for="repeat-title">Task</label>
					<input class="input compact" id="repeat-title" type="text" name="title" placeholder="Laundry, dishes, reset" required>
				</div>
				<div class="field">
					<label class="label" for="repeat-day">Day</label>
					<select class="input compact select" id="repeat-day" name="day">
						<option value="0">Sunday</option>
						<option value="1">Monday</option>
						<option value="2">Tuesday</option>
						<option value="3">Wednesday</option>
						<option value="4">Thursday</option>
						<option value="5">Friday</option>
						<option value="6">Saturday</option>
					</select>
				</div>
				<div class="field">
					<label class="label" for="repeat-time-hour">Time (optional)</label>
					<div class="timeField" data-time-field data-time-label="Repeat task time" data-time-empty="--:--">
						<input type="hidden" id="repeat-time" name="time" data-time-output>
						<button class="timeButton" type="button" data-time-display>--:--</button>
					</div>
				</div>
				<div class="formActions">
					<button class="btn primary" type="submit">Add repeat task</button>
					<button class="btn ghost" type="button" data-repeat-close>Cancel</button>
				</div>
			</form>
		</div>
	</div>

	<div class="timePickerOverlay" data-time-overlay>
		<div class="timePickerCard">
			<div class="timePickerHeader">
				<div class="timePickerTitle" data-time-title>Set time</div>
				<button class="iconBtn" type="button" data-time-close aria-label="Close">&times;</button>
			</div>
	<div class="timePickerBody">
		<div class="timePickerHighlight" aria-hidden="true"></div>
		<div class="timeWheel" data-time-wheel="hour">
			<div class="timeWheelTrack" data-time-hours></div>
		</div>
				<div class="timeWheelDivider">:</div>
				<div class="timeWheel" data-time-wheel="minute">
					<div class="timeWheelTrack" data-time-minutes></div>
				</div>
			</div>
			<div class="timePickerManual">
				<div class="timeManualInputs">
					<input class="timeManualInput" type="text" inputmode="numeric" maxlength="2" placeholder="00" data-time-manual-hour>
					<span>:</span>
					<input class="timeManualInput" type="text" inputmode="numeric" maxlength="2" placeholder="00" data-time-manual-minute>
				</div>
				<div class="timeMeridiem" data-time-meridiem>
					<button class="meridiemBtn" type="button" data-meridiem="am">AM</button>
					<button class="meridiemBtn" type="button" data-meridiem="pm">PM</button>
				</div>
			</div>
			<div class="timePickerActions">
				<button class="btn ghost" type="button" data-time-cancel>Cancel</button>
				<button class="btn primary" type="button" data-time-apply>Set</button>
			</div>
		</div>
	</div>

	<?php require '/var/www/gangdev/candor/files/php/footer.php'; ?>
</div>

</body>
</html>
